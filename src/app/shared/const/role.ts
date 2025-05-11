export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  ADVISOR: "advisor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
