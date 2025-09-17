export const COMPETITION_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "COMPETITION_001",
    message: "Internal server error",
  },
  BAD_REQUEST: {
    code: "COMPETITION_002",
    message: "Bad request",
  },
  NOT_FOUND: {
    code: "COMPETITION_003",
    message: "Competition not found",
  },
  COMPETITION_NOT_FOUND: {
    code: "COMPETITION_004",
    message: "Competition not found",
  },
} as const;

export const COMPETITION_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
