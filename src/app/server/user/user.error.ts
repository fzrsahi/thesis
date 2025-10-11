export const USER_ERROR_RESPONSE = {
  USER_NOT_FOUND: {
    code: "USER_001",
    message: "Pengguna tidak ditemukan",
  },
  INTERNAL_SERVER_ERROR: {
    code: "USER_002",
    message: "Terjadi kesalahan server internal",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "USER_003",
    message: "Email sudah ada",
  },
  INVALID_PASSWORD: {
    code: "USER_004",
    message: "Password saat ini tidak benar",
  },
} as const;

export const USER_ERROR_LOG_MESSAGE = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
