import { HttpStatusCode } from "axios";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { getDocument } from "pdfjs-serverless";

import { UploadTranscriptPayload } from "@/app/shared/schema/student/profile/TranscriptSchema";

import { uploadFile } from "../../google-storage/google-storage.service";
import { sendChatCompletion } from "../../model/azure/azure-openai.service";
import { findStudentByUserId } from "../../student/student.repository";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { TRANSCRIPT_ERROR_RESPONSE } from "../transcript.error";
import { createTranscript } from "../transcript.repository";
import { updateStudentGPA } from "../transcript.repository";


const extractIPK = (text: string): number | null => {
  const match = text.match(
    /(?:Indeks\s+Prestasi\s+Kumulatif\s*\(IPK\)|\bIPK\b)\s*[:\-]?\s*([0-4](?:[.,]\d{1,3})?)/i
  );
  if (!match) return null;
  const num = parseFloat(match[1].replace(",", "."));
  return isFinite(num) ? Number(num.toFixed(2)) : null;
};


const extractIPKFromTotals = (text: string): number | null => {
  const sksMatch = text.match(/Jumlah\s+SKS\s*[:\-]?\s*(\d+)/i);
  const totalMatch = text.match(/Jumlah\s+SKS\s*[x×]\s*Mutu\s*[:\-]?\s*(\d+(?:[.,]\d+)?)/i);
  if (!sksMatch || !totalMatch) return null;

  const totalSks = parseInt(sksMatch[1], 10);
  const totalWeighted = parseFloat(totalMatch[1].replace(",", "."));
  if (!totalSks || !isFinite(totalWeighted)) return null;

  return Number((totalWeighted / totalSks).toFixed(2));
};


export const uploadTranscript = async (userId: number, payload: UploadTranscriptPayload) => {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const [{ summary, ipk }, { id }] = await Promise.all([
    extractTranscriptToText(payload.transcript),
    uploadFile(payload.transcript),
  ]);

  if (!summary) {
    throw customError(
      TRANSCRIPT_ERROR_RESPONSE.ERROR_PROCESSING_TRANSCRIPT.code,
      TRANSCRIPT_ERROR_RESPONSE.ERROR_PROCESSING_TRANSCRIPT.message,
      HttpStatusCode.BadRequest
    );
  }

  await Promise.all([
    createTranscript(student.id, {
      fileId: id,
      semester: payload.semester,
      transcriptText: summary,
    }),
    updateStudentGPA(student.id, ipk?.toString() ?? "")
  ]);
};


const extractTranscriptToText = async (
  transcript: File
): Promise<{ summary: string; ipk: number | null }> => {
  const arrayBuffer = await transcript.arrayBuffer();
  const pdfDataAsUint8Array = new Uint8Array(arrayBuffer);
  const pdfDocument = await getDocument({ data: pdfDataAsUint8Array }).promise;

  const pagePromises = Array.from({ length: pdfDocument.numPages }, (_, i) =>
    pdfDocument.getPage(i + 1)
  );
  const pages = await Promise.all(pagePromises);
  const textContents = await Promise.all(pages.map((p) => p.getTextContent()));

  const extractedText = textContents
    .map((t) => t.items.map((item) => (item as TextItem).str).join(" "))
    .join("\n");

  const requiredElements = [
    "KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI",
    "UNIVERSITAS NEGERI GORONTALO",
    "Fakultas Teknik",
    "Jalan: Jenderal Sudirman No. 6 Kota Gorontalo",
    "Telepon: (0435) 821183 Fax: (0435) 821752",
    "Laman: www.ung.ac.id",
    "Sistem Informasi Akademik",
  ];
  const hasRequiredFormat = requiredElements.some((el) => extractedText.includes(el));
  if (!hasRequiredFormat) {
    throw customError(
      TRANSCRIPT_ERROR_RESPONSE.FORMAT_PDF_TRANSCRIPT.code,
      TRANSCRIPT_ERROR_RESPONSE.FORMAT_PDF_TRANSCRIPT.message,
      HttpStatusCode.BadRequest
    );
  }

  const formattedText = extractedText
    .replace(/KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI/g, "")
    .replace(/UNIVERSITAS NEGERI GORONTALO/g, "")
    .replace(/Fakultas Teknik/g, "")
    .replace(/Jalan: Jenderal Sudirman No\. 6 Kota Gorontalo/g, "")
    .replace(/Telepon: \(0435\) 821183 Fax: \(0435\) 821752/g, "")
    .replace(/Laman: www\.ung\.ac\.id/g, "")
    .replace(/Sistem Informasi Akademik/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2} (AM|PM)/g, "")
    .replace(/No\s+Kode\s+Nama Mata Kuliah\s+SKS\s+Mutu\s+Lambang/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const ipk = extractIPK(formattedText) ?? extractIPKFromTotals(formattedText);

  const summary = await transcriptTextToSummary(formattedText);

  return { summary, ipk };
};


const transcriptTextToSummary = async (transcriptText: string) =>
  sendChatCompletion(
    `
    Anda adalah seorang analis akademik yang ahli dalam mengidentifikasi potensi mahasiswa berdasarkan transkrip nilai.
    Tugas Anda adalah membuat ringkasan naratif dari transkrip nilai seorang mahasiswa Teknik Informatika.
    Konteks Penting: Ringkasan ini akan diubah menjadi vector embedding untuk mencocokkan mahasiswa dengan kompetisi IT yang relevan.
    Oleh karena itu, ringkasan harus padat dengan informasi yang menyoroti keahlian dan kekuatan mahasiswa.

    Instruksi:
    1. **Fokus Utama**: Identifikasi dan sebutkan mata kuliah di bidang teknis (Pemrograman, Algoritma, AI, Jaringan, Basis Data, dsb) di mana mahasiswa mendapat nilai tinggi (A/B).
    2. **Sintesis Keahlian**: Gabungkan jadi paragraf yang menjelaskan kekuatan mahasiswa.
    3. **Abaikan Non-Teknis**: Abaikan mata kuliah umum seperti Agama, Kewarganegaraan, Bahasa.
    4. **Format**: Satu paragraf ringkas dalam bahasa Indonesia.

    Berikut teks transkrip: ${transcriptText}
    `
  );
