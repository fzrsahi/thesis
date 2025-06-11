export const USER_ERROR_RESPONSE = {
  USER_NOT_FOUND: {
    code: "USER_001",
    message: "User not found",
  },
  INTERNAL_SERVER_ERROR: {
    code: "USER_002",
    message: "Internal server error",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "USER_003",
    message: "Email already exists",
  },
} as const;

export const USER_ERROR_LOG = {
  INTERNAL_SERVER_ERROR: "Internal server error",
};
