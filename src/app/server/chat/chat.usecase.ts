import { PromptTemplate } from "@langchain/core/prompts";

import { appendMessageToSession, findOrCreateLatestSessionForUser } from "./chat.repository";
import { findAdminByUserId } from "../admin/admin.repository";
import { findAdvisorByUserId } from "../advisor/advisor.repository";
import { createOpenAIClient } from "../model/azure/azure-openai.service";
import { findStudentByUserId } from "../student/student.repository";
import { getLogger } from "../utils/helpers/pino.helper";
import {
  getCompetitionVectorStore,
  getDocumentChunksVectorStore,
  getStudentDocumentChunksVectorStore,
} from "../vector/pgvector.service";

// Helper types for vector store results
type VectorDocWithMeta = {
  pageContent?: string;
  metadata?: {
    id?: number;
    competitionId?: number;
    [key: string]: unknown;
  };
  id?: number;
  [key: string]: unknown;
};

type StudentChunkDoc = {
  pageContent?: string;
  [key: string]: unknown;
};

export const chatUseCase = async (message: string, userId: number) => {
  try {
    const user = await handleUser(userId);
    const session = await findOrCreateLatestSessionForUser(userId);
    await appendMessageToSession(session.id, "user", message);

    let data = "";
    if (user.student) {
      data = await handleStudentChat(message, userId);
    } else if (user.advisor) {
      data = await handleStudentChat(message, userId);
    } else if (user.admin) {
      data = await handleStudentChat(message, userId);
    }

    await appendMessageToSession(session.id, "assistant", data);

    return {
      id: "msg_1",
      content: data,
    };
  } catch (e) {
    const logger = getLogger({ module: "server/chat" });
    logger.error({ err: String(e) }, "chatUseCase error");
    return {
      id: "msg_1",
      content: "Maaf, sesi chat dibatalkan atau terjadi kesalahan.",
    };
  }
};

const handleUser = async (userId: number) => {
  const [student, advisor, admin] = await Promise.all([
    findStudentByUserId(userId),
    findAdvisorByUserId(userId),
    findAdminByUserId(userId),
  ]);

  return {
    student,
    advisor,
    admin,
  };
};

// Refine user's free-form question into a concise, keyword-focused search query (Kompetisi)
const refineQuery = async (message: string) => {
  const SYSTEM = `🎯 Query Refiner Prompt (Kompetisi)
Profil

Asisten khusus untuk mendapatkan informasi secara efisien dari basis data vektor terkait kompetisi mahasiswa. Memahami maksud sebenarnya dari pengguna dan menyempurnakan kueri sambil mempertahankan maksud tersebut.

Identifikasi Maksud

- Pengambilan informasi: Mencari informasi umum tentang kompetisi.
- Konfirmasi prosedur: Menanyakan langkah atau tahapan (misalnya cara mendaftar, seleksi).
- Konfirmasi persyaratan: Memeriksa syarat (misalnya IPK minimal, keterampilan, jumlah anggota tim).
- Konfirmasi dokumen: Mengecek keberadaan dokumen lomba (panduan, rulebook, guideline).
- Pengambilan dokumen: Meminta akses ke dokumen lomba tertentu.
- Konfirmasi batasan: Mengecek larangan atau pembatasan (misalnya usia, status mahasiswa).
- Lainnya: Pertanyaan umum terkait lomba yang tidak termasuk kategori di atas.

Prioritas untuk Kasus Ambigu

Konfirmasi batasan → Konfirmasi/Pengambilan dokumen → Konfirmasi prosedur → Konfirmasi persyaratan → Pengambilan informasi → Lainnya

Penanganan Kueri Gabungan

Jika pertanyaan berisi beberapa maksud, keluarkan kata kunci untuk masing-masing maksud di baris terpisah. Urutkan sesuai prioritas.

Penanganan Bentuk Negatif dan Positif

"Tidak boleh", "larangan", "pembatasan" → diproses sebagai Konfirmasi batasan
"Boleh", "diizinkan", "dapat dilakukan" → diproses sebagai Konfirmasi persyaratan atau Pengambilan informasi

Aturan Penyederhanaan Kata Kunci

- Untuk pertanyaan eksistensi (“Apakah ada…?”), keluarkan hanya kata kunci inti.
- Hilangkan frasa bertele-tele seperti "tentang", "mengenai", "ada atau tidak".
- Selalu ekstrak kata kunci inti yang optimal untuk pencarian basis data vektor.
- Jika kata terkait gambar ada (misalnya "gambar", "poster", "ilustrasi"), wajib dipertahankan dan tambahkan sinonim:
  - 「poster」 → 「poster gambar ilustrasi」
  - 「gambar」 → 「gambar ilustrasi image photo」
  - 「diagram」 → 「diagram chart figure」

Contoh

- “Apa syarat mengikuti GEMASTIK AI track?” → GEMASTIK syarat AI track
- “Bagaimana cara mendaftar PKM?” → PKM prosedur pendaftaran
- “Apakah ada poster lomba LIDM?” → LIDM poster gambar ilustrasi
- “Hal yang tidak boleh saat lomba hackathon?” → Hackathon batasan

Pertimbangan Konteks

Jika terkait dengan topik sebelumnya, tambahkan judul kompetisi yang relevan.
Contoh ambigu: “Cara submit proposal” → jika konteks sebelumnya PKM, maka → PKM prosedur submit proposal

Format Output

Hanya keluarkan kata kunci yang sudah disempurnakan.
Jika ada lebih dari satu kata kunci, pisahkan dengan \n.
Jangan sertakan penjelasan atau proses berpikir.`;
  const TEMPLATE = `${SYSTEM}\n\nPERTANYAAN:\n{q}\n\nKUERI:`;
  const model = createOpenAIClient();
  const prompt = new PromptTemplate({ template: TEMPLATE, inputVariables: ["q"] });
  const final = await prompt.format({ q: message });
  const res = await model.invoke(final);
  const content = res.content as unknown;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((p: { type?: string; text?: string } | string) =>
        typeof p === "object" && p !== null && p.type === "text"
          ? p.text
          : typeof p === "string"
            ? p
            : ""
      )
      .join("")
      .trim();
  }
  return String(content ?? "").trim();
};

// Build a consolidated context via two-stage retrieval:
// 1) Student personal vector
// 2) Coarse: competitions → Fine: documentChunks per candidate competition
const buildStudentRagContext = async (userId: number, message: string) => {
  const student = await findStudentByUserId(userId, { id: true });
  if (!student) return "";

  // Step 0: refine the query to improve retrieval accuracy
  const refined = await refineQuery(message);

  const retrievalQuery = refined || message;

  const contextBlocks: string[] = [];
  const DISTANCE_STEPS = [0.35, 0.5, 0.7, 1.0]; // adaptive backoff

  const filterWithBackoff = (pairs: Array<[unknown, number]>, take: number) => {
    for (let i = 0; i < DISTANCE_STEPS.length; i += 1) {
      const th = DISTANCE_STEPS[i];
      const filtered = pairs.filter(([, score]) => typeof score === "number" && score <= th);
      if (filtered.length) return filtered.slice(0, take).map(([doc]) => doc as unknown);
    }
    // If still empty, return top-N regardless as last resort
    return pairs.slice(0, take).map(([doc]) => doc as unknown);
  };

  // 1) Student-owned context
  try {
    const studentStore = getStudentDocumentChunksVectorStore();
    const studentPairs = await studentStore.similaritySearchWithScore(retrievalQuery, 6, {
      studentId: { in: [student.id] },
    });
    const filtered = filterWithBackoff(
      studentPairs as Array<[unknown, number]>,
      3
    ) as StudentChunkDoc[];
    if (filtered.length) {
      contextBlocks.push(
        "[Konteks Mahasiswa]",
        ...filtered.map((doc, idx) => `${idx + 1}. ${doc.pageContent}`)
      );
    }
  } catch {
    // ignore
  }

  const competitionStore = getCompetitionVectorStore();
  const competitionPairs = await competitionStore.similaritySearchWithScore(retrievalQuery, 6);
  const filteredCompetitions = filterWithBackoff(
    competitionPairs as Array<[unknown, number]>,
    3
  ) as VectorDocWithMeta[];
  const candidateCompetitionIds = filteredCompetitions
    .map((doc) => {
      if (doc && typeof doc === "object") {
        if ("metadata" in doc && doc.metadata && typeof doc.metadata === "object") {
          return (
            (doc.metadata as { id?: number; competitionId?: number }).id ??
            (doc.metadata as { id?: number; competitionId?: number }).competitionId
          );
        }
        if ("id" in doc) {
          return (doc as { id?: number }).id;
        }
      }
      return undefined;
    })
    .filter((id): id is number => typeof id === "number");

  await Promise.all(
    candidateCompetitionIds.map(async (compId) => {
      try {
        const chunkStore = getDocumentChunksVectorStore();
        const chunkPairs = await chunkStore.similaritySearchWithScore(retrievalQuery, 6, {
          competitionId: { in: [compId] },
        });
        const filteredChunks = filterWithBackoff(
          chunkPairs as Array<[unknown, number]>,
          3
        ) as VectorDocWithMeta[];
        if (filteredChunks.length) {
          contextBlocks.push(
            `[Konteks Kompetisi ${compId}]`,
            ...filteredChunks.map((doc, idx) => `${idx + 1}. ${doc.pageContent}`)
          );
        }
      } catch {
        // ignore per-competition retrieval errors
      }
    })
  );

  return contextBlocks.join("\n\n");
};

const handleStudentChat = async (message: string, userId: number) => {
  const context = await buildStudentRagContext(userId, message);

  const SYSTEM_PROMPT = `🤖 Generate Answer Prompt (Kompetisi)
Peran

Anda adalah Asisten Kompetisi Mahasiswa, bertugas menjawab pertanyaan mahasiswa atau dosen pembimbing tentang kompetisi, berdasarkan dokumen kompetisi dan data yang ada.

Pertanyaan Pengguna

{question}

Latar Belakang

- Pengguna adalah mahasiswa/dosen internal yang ingin tahu informasi lomba.
- Jawaban harus berdasarkan dokumen kompetisi yang tersedia.
- Jangan berasumsi atau menambahkan informasi di luar dokumen.

Instruksi

1. Baca dan pahami pertanyaan pengguna.
2. Cek potongan dokumen kompetisi yang tersedia untuk memahami konteks.
3. Identifikasi bagian dokumen yang paling relevan.
4. Buat jawaban singkat, jelas, dan hanya berdasarkan informasi yang tersedia.
5. Jika ada aturan penting, syarat, atau tahapan, tampilkan dalam bentuk poin agar mudah dibaca.

SOP

- Jika hasil pencarian relevan: jawab langsung dengan informasi dari dokumen.
- Jika hasil pencarian ada tapi kurang tepat: jawab dengan klarifikasi, contoh:
  「Informasi serupa ditemukan pada dokumen terkait. Apakah ini yang Anda maksud?」
- Jika tidak ada data relevan: jawab dengan sopan, contoh:
  「Tidak ada informasi terkait pertanyaan Anda dalam dokumen lomba yang tersedia. Silakan hubungi penyelenggara kompetisi untuk detail lebih lanjut.」
- Jika pertanyaan terlalu umum/abstrak: jangan jawab langsung, minta klarifikasi dengan memberikan contoh kategori (misalnya: syarat, prosedur, deadline).

Catatan Akhir

- Jangan menambahkan asumsi.
- Nada profesional, ramah, dan ringkas.`;

  const TEMPLATE = `${SYSTEM_PROMPT}

KONTEN (hasil pencarian):
{context}

JAWAB:`;

  const model = createOpenAIClient();
  const prompt = new PromptTemplate({
    template: TEMPLATE,
    inputVariables: ["context", "question"],
  });
  const finalPrompt = await prompt.format({
    context: context || "(Konteks kosong)",
    question: message,
  });

  const response = await model.invoke(finalPrompt);
  const content = response.content as unknown;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p: { type?: string; text?: string } | string) =>
        typeof p === "object" && p !== null && p.type === "text"
          ? p.text
          : typeof p === "string"
            ? p
            : ""
      )
      .join("");
  }
  return String(content ?? "");
};
