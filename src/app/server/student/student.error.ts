export const STUDENT_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "STUDENT_001",
    message: "Terjadi kesalahan server internal",
  },
  STUDENT_NOT_FOUND: {
    code: "STUDENT_002",
    message: "Mahasiswa tidak ditemukan",
  },
  BAD_REQUEST: {
    code: "STUDENT_003",
    message: "Permintaan tidak valid",
  },
  NOT_COMPLETED_PROFILE: {
    code: "STUDENT_004",
    message: "Profil mahasiswa tidak lengkap",
  },
  STUDENT_ALREADY_EXISTS: {
    code: "STUDENT_005",
    message: "Mahasiswa sudah ada",
  },
  STUDENT_ID_ALREADY_EXISTS: {
    code: "STUDENT_006",
    message: "NIM mahasiswa sudah ada",
  },
};

export const STUDENT_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan server internal",
};
