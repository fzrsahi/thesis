import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";

import {
  generateCompetitionResponseSchema,
  GenerateCompetitionResponse,
} from "../../model/azure/types/generate-competition.types";

import "@ungap/with-resolvers";
import { prisma } from "@/app/server/prisma/prisma";

import { createOpenAIClient } from "../../model/azure/azure-openai.service";
import {
  getDocumentChunksRetriever,
  getDocumentChunksVectorStore,
} from "../../vector/pgvector.service";

import { PromptTemplate } from "@langchain/core/prompts";

export const generateCompetitionUsecase = async (
  payload: CreateCompetitionGeneratePayload
): Promise<GenerateCompetitionResponse | undefined> => {
  const { file, title, description, website, startPage, endPage } = payload;

  if (!file) return;

  const pdfText = await extractTextFromPdfBuffer(file, startPage, endPage);

  const chunks = await splitTextIntoChunks(pdfText);

  const competition = await prisma.competitions.create({
    data: {
      title,
      description: description || "",
      field: [],
      sourceUrl: website,
      content: pdfText,
    },
  });
  await saveChunksToPostgres(chunks, competition.id);
  const topK = 10;
  const contextDocs = await getRelevantChunksBySimilarity(title, topK, competition.id);
  const contextText = contextDocs.map((doc) => doc.pageContent).join("\n\n");
  const model = createOpenAIClient();

  const structuredModel = model.withStructuredOutput<GenerateCompetitionResponse>(
    generateCompetitionResponseSchema
  );

  const prompt = new PromptTemplate({
    template: `Anda adalah Asisten Ahli untuk Ekstraksi Data Kompetisi. Tugas utama Anda adalah membaca dengan teliti KONTEKS yang disediakan dari dokumen panduan kompetisi, lalu mengekstrak informasi secara akurat untuk mengisi setiap field dalam skema JSON yang telah ditentukan.

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
    - Jika organizer tidak jelas, coba identifikasi dari header, footer, atau konteks dokumen`,
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
  return await chain.invoke({
    title: payload.title,
    description: payload.description,
    website: payload.website,
    additionalDetailsText: payload.additionalDetails || "",
    context: contextText,
    currentYear: new Date().getFullYear(),
  });
};

export const extractTextFromPdfBuffer = async (
  fileBuffer: File,
  startPage: number = 1,
  endPage?: number
): Promise<string> => {
  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");

  const arrayBuffer = await fileBuffer.arrayBuffer();
  const pdfDataAsUint8Array = new Uint8Array(arrayBuffer);
  const loadingTask = getDocument({ data: pdfDataAsUint8Array });
  const pdf = await loadingTask.promise;

  const totalPages = pdf.numPages;
  const finalEndPage = endPage ?? totalPages;

  const texts: string[] = [];

  for (let pageNum = startPage; pageNum <= finalEndPage; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    texts.push(pageText);
  }

  return texts.join("\n\n");
};

export const splitTextIntoChunks = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await splitter.createDocuments([text]);
};

export const saveChunksToPostgres = async (chunks: Document[], competitionId: number) => {
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

export const getRelevantChunksBySimilarity = async (
  query: string,
  topK = 5,
  competitionId: number
) => {
  const retriever = getDocumentChunksRetriever(topK, competitionId);
  return await retriever.invoke(query);
};
