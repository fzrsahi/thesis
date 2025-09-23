export const TRANSCRIPT_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "TRANSCRIPT_001",
    message: "Terjadi kesalahan server internal.",
  },
  BAD_REQUEST: {
    code: "TRANSCRIPT_002",
    message: "Permintaan tidak valid.",
  },
  NOT_FOUND: {
    code: "TRANSCRIPT_003",
    message: "Transkrip tidak ditemukan.",
  },
  ERROR_PROCESSING_TRANSCRIPT: {
    code: "TRANSCRIPT_004",
    message: "Terjadi kesalahan saat memproses teks transkrip.",
  },
  FORMAT_PDF_TRANSCRIPT: {
    code: "TRANSCRIPT_005",
    message:
      "Format transkrip tidak valid. Silakan unggah transkrip resmi dari https://siat.ung.ac.id.",
  },
} as const;

export const TRANSCRIPT_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan server internal:",
};
