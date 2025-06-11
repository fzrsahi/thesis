export const TRANSCRIPT_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "TRANSCRIPT_001",
    message: "Internal server error.",
  },
  BAD_REQUEST: {
    code: "TRANSCRIPT_002",
    message: "Bad request.",
  },
  NOT_FOUND: {
    code: "TRANSCRIPT_003",
    message: "Transcript not found.",
  },
} as const;

export const TRANSCRIPT_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error:",
};
