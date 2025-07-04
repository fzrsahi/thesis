import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { competitions } from "@prisma/client";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getDocument } from "pdfjs-serverless";

import { prisma } from "@/app/server/prisma/prisma";
import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { uploadFile } from "../../google-drive/google-drive.service";
import { createOpenAIClient } from "../../model/azure/azure-openai.service";
import {
  generateCompetitionResponseSchema,
  GenerateCompetitionResponse,
} from "../../model/azure/types/generate-competition.types";
import {
  getDocumentChunksRetriever,
  getDocumentChunksVectorStore,
} from "../../vector/pgvector.service";
import { createCompetition, updateCompetitionById } from "../competition.repository";
import { generateCompetitionText, storeToVectorStore } from "../helper/competition.helper";

import "@ungap/with-resolvers";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const TOP_K_CHUNKS = 10;

const COMPETITION_PROMPT_TEMPLATE = `Anda adalah Asisten Ahli untuk Ekstraksi Data Kompetisi. Tugas utama Anda adalah membaca dengan teliti KONTEKS yang disediakan dari dokumen panduan kompetisi, lalu mengekstrak informasi secara akurat untuk mengisi setiap field dalam skema JSON yang telah ditentukan.

PERAN DAN TUGAS:
1.  Baca dan Pahami: Analisis KONTEKS dari dokumen secara mendalam untuk menemukan semua detail yang relevan.
2.  Ekstrak Informasi: Isi setiap field dalam struktur JSON yang diminta berdasarkan data yang ada di KONTEKS.
3.  Gunakan Input Tambahan: Manfaatkan informasi dari INPUT PENGGUNA (jika ada) sebagai petunjuk atau pelengkap.
4.  Tangani Data Kosong: Jika informasi untuk sebuah field tidak dapat ditemukan secara eksplisit dalam dokumen, gunakan pengetahuan umum Anda atau informasi dari database untuk memberikan nilai yang wajar dan relevan. Hanya gunakan null jika benar-benar tidak ada informasi yang bisa didapat.
5.  Patuhi Format: Pastikan semua data yang diekstrak sesuai dengan tipe data yang diharapkan (string, angka, array, objek). Untuk tanggal, gunakan format YYYY-MM-DD jika memungkinkan.
6.  Fokus pada Akurasi: Prioritaskan keakuratan dan kesetiaan pada sumber informasi, namun jika informasi tidak tersedia dalam dokumen, gunakan pengetahuan yang relevan untuk melengkapi data.
7.  Inferensi Cerdas: Untuk field seperti relevantCourses dan relevantSkills, gunakan pemahaman Anda tentang jenis kompetisi untuk memberikan saran mata kuliah dan keterampilan yang relevan berdasarkan tipe dan bidang kompetisi.

INPUT PENGGUNA:
Nama Kompetisi: {title}
Deskripsi Singkat: {description}
Website Resmi: {website}
{additionalDetailsText}

KONTEKS (Teks dari Dokumen Panduan):
{context}

PETUNJUK TAMBAHAN:
- Jika tidak ada informasi tanggal dalam dokumen, perkirakan berdasarkan konteks atau pola umum kompetisi serupa
- Untuk field type, klasifikasikan berdasarkan karakteristik kompetisi yang teridentifikasi
- Untuk relevantCourses dan relevantSkills, berikan rekomendasi yang masuk akal berdasarkan jenis dan bidang kompetisi
- Jika organizer tidak jelas, coba identifikasi dari header, footer, atau konteks dokumen`;

export const generateCompetitionUsecase = async (
  payload: CreateCompetitionGeneratePayload
): Promise<GenerateCompetitionResponse | undefined> => {
  const { file, title, startPage, endPage } = payload;

  if (!file) {
    return undefined;
  }

  const [{ id: fileId }, pdfText] = await Promise.all([
    uploadFile(file),
    extractTextFromPdfBuffer(file, startPage, endPage),
  ]);
  const competition = await createCompetition(createInitialCompetitionData(payload));
  const chunks = await splitTextIntoChunks(pdfText);
  await saveChunksToPostgres(chunks, competition.id);
  const contextText = await getContextText(title, competition.id);
  const result = await generateCompetitionData(payload, contextText);

  const competitionUpdateData = buildCompetitionUpdateData(
    payload,
    result,
    pdfText,
    fileId,
    competition
  );

  await updateCompetitionById(competition.id, competitionUpdateData);
  const competitionText = generateCompetitionText(result as CreateCompetitionPayload);
  await storeToVectorStore(competition, competitionText);
  return result;
};

const createInitialCompetitionData = (payload: CreateCompetitionGeneratePayload) => ({
  title: payload.title,
  description: payload.description,
  field: [],
  type: null,
  organizer: null,
  sourceUrl: payload.website,
  competitionStatistics: {
    summary: null,
    totalApplicantsPastYear: [],
    pastUngParticipants: [],
  },
  requirements: {
    teamComposition: null,
    originality: null,
    other: null,
  },
  minGPA: null,
  startDate: null,
  endDate: null,
  location: null,
  evaluationCriteria: {
    preliminaryRound: null,
    finalRound: null,
    other: "",
  },
  relevantCourses: [],
  relevantSkills: [],
});

const extractTextFromPdfBuffer = async (
  fileBuffer: File,
  endPage?: number,
  startPage: number = 1
): Promise<string> => {
  const arrayBuffer = await fileBuffer.arrayBuffer();
  const pdfDataAsUint8Array = new Uint8Array(arrayBuffer);
  const loadingTask = getDocument({ data: pdfDataAsUint8Array });
  const pdf = await loadingTask.promise;

  const totalPages = pdf.numPages;
  const finalEndPage = endPage ?? totalPages;
  const texts: string[] = [];

  const pagePromises = [];
  for (let pageNum = startPage; pageNum <= finalEndPage; pageNum += 1) {
    pagePromises.push(
      pdf.getPage(pageNum).then(async (page) => {
        const content = await page.getTextContent();
        return content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
      })
    );
  }

  const pageTexts = await Promise.all(pagePromises);
  texts.push(...pageTexts);

  return texts.join("\n\n");
};

const splitTextIntoChunks = async (text: string): Promise<Document[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  return splitter.createDocuments([text]);
};

const saveChunksToPostgres = async (chunks: Document[], competitionId: number): Promise<void> => {
  const documents = chunks.map((chunk) => ({
    competitionId,
    content: chunk.pageContent,
  }));

  const savedDocuments = await prisma.$transaction(
    documents.map((document) =>
      prisma.documentChunks.create({
        data: document,
      })
    )
  );

  const vectorStore = getDocumentChunksVectorStore();
  await vectorStore.addModels(savedDocuments);
};

const getContextText = async (title: string, competitionId: number): Promise<string> => {
  const contextDocs = await getRelevantChunksBySimilarity(title, TOP_K_CHUNKS, competitionId);
  return contextDocs.map((doc) => doc.pageContent).join("\n\n");
};

const getRelevantChunksBySimilarity = async (
  query: string,
  topK: number,
  competitionId: number
): Promise<Document[]> => {
  const retriever = getDocumentChunksRetriever(competitionId, topK);
  return retriever.invoke(query);
};

const generateCompetitionData = async (
  payload: CreateCompetitionGeneratePayload,
  contextText: string
): Promise<GenerateCompetitionResponse> => {
  const model = createOpenAIClient();
  const structuredModel = model.withStructuredOutput<GenerateCompetitionResponse>(
    generateCompetitionResponseSchema
  );

  const prompt = new PromptTemplate({
    template: COMPETITION_PROMPT_TEMPLATE,
    inputVariables: [
      "title",
      "description",
      "website",
      "additionalDetailsText",
      "context",
      "currentYear",
    ],
  });

  const chain = prompt.pipe(structuredModel);

  return chain.invoke({
    title: payload.title,
    description: payload.description,
    website: payload.website,
    additionalDetailsText: payload.additionalDetails || "",
    context: contextText,
    currentYear: new Date().getFullYear(),
  });
};

const buildCompetitionUpdateData = (
  payload: CreateCompetitionGeneratePayload,
  result: GenerateCompetitionResponse,
  pdfText: string,
  fileId: string,
  competition: { id: number; createdAt: Date }
): competitions => ({
  id: competition.id,
  createdAt: competition.createdAt,
  updatedAt: new Date(),
  title: payload.title,
  description: result.description || "",
  type: result.type,
  organizer: result.organizer,
  sourceUrl: result.sourceUrl,
  field: result.field || [],
  requirements: result.requirements,
  minGPA: result.minGPA || "",
  startDate: result.startDate ? new Date(result.startDate) : null,
  endDate: result.endDate ? new Date(result.endDate) : null,
  location: result.location,
  evaluationCriteria: result.evaluationCriteria || {
    preliminaryRound: null,
    finalRound: null,
    other: "",
  },
  relevantCourses: result.relevantCourses || [],
  relevantSkills: result.relevantSkills || [],
  content: pdfText,
  fileId,
});
