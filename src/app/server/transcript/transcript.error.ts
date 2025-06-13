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
  ERROR_PROCESSING_TRANSCRIPT: {
    code: "TRANSCRIPT_004",
    message: "Error processing transcript text.",
  },
  FORMAT_PDF_TRANSCRIPT: {
    code: "TRANSCRIPT_005",
    message:
      "The transcript format is not valid. Please upload the official transcript from https://siat.ung.ac.id.",
  },
} as const;

export const TRANSCRIPT_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error:",
};
