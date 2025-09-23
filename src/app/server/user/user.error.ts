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
} as const;

export const USER_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
