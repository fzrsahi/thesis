import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      advisorType?: string | null;
      studyProgram?: { id: number; name: string } | null;
      entryYear?: number | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    role: string;
    advisorType?: string | null;
    studyProgram?: { id: number; name: string } | null;
    entryYear?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    advisorType?: string | null;
    studyProgram?: { id: number; name: string } | null;
    entryYear?: number | null;
  }
}
