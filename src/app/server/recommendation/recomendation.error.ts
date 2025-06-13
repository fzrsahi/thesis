export const RECOMMENDATION_ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: "REC_001",
    message: "Internal server error",
  },
  NOT_FOUND: {
    code: "REC_002",
    message: "Recommendation not found",
  },
};

export const RECOMMENDATION_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error in recommendation generation:",
};
