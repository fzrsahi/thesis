export const COMPETITION_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "COMPETITION_001",
    message: "Internal server error",
  },
  BAD_REQUEST: {
    code: "COMPETITION_002",
    message: "Bad request",
  },
} as const;

export const COMPETITION_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
