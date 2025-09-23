export const STUDENT_ERROR_RESPONSE = {
  STUDENT_NOT_FOUND: {
    code: "STUDENT_001",
    message: "Mahasiswa tidak ditemukan.",
  },
  STUDENT_ALREADY_EXISTS: {
    code: "STUDENT_002",
    message: "Mahasiswa sudah ada.",
  },
  INTERNAL_SERVER_ERROR: {
    code: "STUDENT_003",
    message: "Terjadi kesalahan server internal.",
  },
  BAD_REQUEST: {
    code: "STUDENT_004",
    message: "Permintaan tidak valid.",
  },
};

export const STUDENT_ERROR_LOG_MESSAGE = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan server internal.",
};
