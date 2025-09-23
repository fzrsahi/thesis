export const ADVISOR_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "ADVISOR_001",
    message: "Terjadi kesalahan server internal.",
  },
  BAD_REQUEST: {
    code: "ADVISOR_002",
    message: "Permintaan tidak valid.",
  },
  ADVISOR_ALREADY_EXISTS: {
    code: "ADVISOR_003",
    message: "Dosen pembimbing sudah ada.",
  },
  ADVISOR_NOT_FOUND: {
    code: "ADVISOR_004",
    message: "Dosen pembimbing tidak ditemukan.",
  },
};

export const ADVISOR_ERROR_LOG_MESSAGE = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan server internal.",
};
