export const STUDY_PROGRAM_ERROR_LOG_MESSAGE = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan server internal",
} as const;

export const STUDY_PROGRAM_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "STUDY_PROGRAM_001",
    message: "Terjadi kesalahan server internal",
  },
} as const;
