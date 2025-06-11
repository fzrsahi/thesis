export const AUTH_ERRORS_RESPONSE = {
  INVALID_CREDENTIALS: {
    code: "AUTH_001",
    message: "Email address or password is incorrect.",
  },
  NOT_FOUND: {
    code: "AUTH_002",
    message: "Account not found.",
  },
  UNAUTHORIZED_ACCESS: {
    code: "AUTH_003",
    message: "Access denied.",
  },
  TOKEN_EXPIRED: {
    code: "AUTH_004",
    message: "Session has expired. Please log in again.",
  },
  INVALID_REQUEST: {
    code: "AUTH_005",
    message: "Email address and password are required.",
  },
  AUTHENTICATION_FAILED: {
    code: "AUTH_006",
    message: "Authentication failed. Please try again.",
  },
  INVALID_FORMAT: {
    code: "AUTH_007",
    message: "Invalid request format.",
  },
  MISSING_TOKEN: {
    code: "AUTH_008",
    message: "Token is missing. Please log in.",
  },
  CONTRACT_EXPIRED: {
    code: "AUTH_009",
    message: "Contract period has ended.",
  },
  ACCOUNT_DELETED: {
    code: "AUTH_010",
    message: "Your account is inactive or has been deleted. Please contact the administrator.",
  },
  ROLE_CHANGED: {
    code: "AUTH_011",
    message: "Your account role has changed. Please log in again.",
  },
} as const;

export const AUTH_ERRORS_LOG = {
  AUTHENTICATION_ERROR: "Authentication error:",
  REQUEST_PARSE_ERROR: "Request parsing error:",
  TOKEN_EXPIRED: "Token expired:",
  MISSING_TOKEN: "Token is missing:",
  CONTRACT_EXPIRED: "Contract has expired:",
  ACCOUNT_DELETED: "Account has been deleted:",
  ROLE_CHANGED: "User role has changed:",
};
