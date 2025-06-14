import { HttpStatusCode } from "axios";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

import { UploadTranscriptPayload } from "@/app/shared/schema/student/profile/TranscriptSchema";

import { uploadFile } from "../../google-drive/google-drive.service";
import { findStudentByUserId } from "../../student/student.repository";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { TRANSCRIPT_ERROR_RESPONSE } from "../transcript.error";
import { createTranscript } from "../transcript.repository";

import "@ungap/with-resolvers";

export const uploadTranscript = async (userId: number, payload: UploadTranscriptPayload) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const [transcriptText, { id }] = await Promise.all([
    extractTranscriptToText(payload.transcript),
    uploadFile(payload.transcript),
  ]);

  if (!transcriptText) {
    throw customError(
      TRANSCRIPT_ERROR_RESPONSE.ERROR_PROCESSING_TRANSCRIPT.code,
      TRANSCRIPT_ERROR_RESPONSE.ERROR_PROCESSING_TRANSCRIPT.message,
      HttpStatusCode.BadRequest
    );
  }

  await createTranscript(student.id, {
    fileId: id,
    semester: payload.semester,
    transcriptText,
  });
};

const extractTranscriptToText = async (transcript: File) => {
  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");

  const arrayBuffer = await transcript.arrayBuffer();
  const pdfDataAsUint8Array = new Uint8Array(arrayBuffer);

  const pdfDocument = await pdfjs.getDocument({ data: pdfDataAsUint8Array }).promise;

  let extractedText = "";

  const pagePromises = Array.from({ length: pdfDocument.numPages }, (_, i) =>
    pdfDocument.getPage(i + 1)
  );

  const pages = await Promise.all(pagePromises);
  const textContentPromises = pages.map((page) => page.getTextContent());
  const textContents = await Promise.all(textContentPromises);

  extractedText = textContents
    .map((textContent) => textContent.items.map((item) => (item as TextItem).str).join(" "))
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

  const hasRequiredFormat = requiredElements.some((element) => extractedText.includes(element));

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

  return transcriptTextToSummary(formattedText);
};

const transcriptTextToSummary = async (transcriptText: string) =>
  sendPrompt({
    systemMessage: `
    Anda adalah seorang analis akademik yang ahli dalam mengidentifikasi potensi mahasiswa berdasarkan transkrip nilai.
    Tugas Anda adalah membuat ringkasan naratif dari transkrip nilai seorang mahasiswa Teknik Informatika.
    `,
    userMessage: `Konteks Penting: Ringkasan ini akan diubah menjadi vector embedding untuk mencocokkan mahasiswa dengan kompetisi IT yang relevan. Oleh karena itu, ringkasan harus padat dengan informasi yang menyoroti keahlian dan kekuatan mahasiswa.
    Instruksi:
    1.  **Fokus Utama**: Identifikasi dan sebutkan mata kuliah di bidang teknis (seperti Pemrograman, Algoritma, Jaringan Komputer, Kecerdasan Buatan, Basis Data, Keamanan Siber, Desain UI/UX) di mana mahasiswa mendapatkan nilai tinggi (A atau B).
    2.  **Sintesis Keahlian**: Jangan hanya mendaftar mata kuliah. Simpulkan menjadi sebuah paragraf yang menjelaskan kekuatan dan potensi keahlian mahasiswa. Contoh: "Mahasiswa ini menunjukkan keunggulan di bidang pengembangan perangkat lunak, terbukti dari nilai A pada mata kuliah Algoritma dan Pemrograman Lanjut."
    3.  **Abaikan yang Tidak Relevan**: Abaikan sepenuhnya mata kuliah umum dan non-teknis (seperti Pendidikan Agama, Kewarganegaraan, Bahasa Indonesia) karena tidak relevan untuk pencocokan kompetisi IT.
    4.  **Format**: Respons harus berupa satu paragraf ringkas dalam format teks biasa (plain text) dan dalam bahasa Indonesia.
    Berikut adalah teks transkripnya: ${transcriptText}`,
  });
