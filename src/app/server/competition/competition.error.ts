export const COMPETITION_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "COMPETITION_001",
    message: "Terjadi kesalahan server internal",
  },
  BAD_REQUEST: {
    code: "COMPETITION_002",
    message: "Permintaan tidak valid",
  },
  NOT_FOUND: {
    code: "COMPETITION_003",
    message: "Kompetisi tidak ditemukan",
  },
  COMPETITION_NOT_FOUND: {
    code: "COMPETITION_004",
    message: "Kompetisi tidak ditemukan",
  },
} as const;

export const COMPETITION_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
