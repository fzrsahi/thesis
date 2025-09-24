import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { findAdvisorByUserId } from "@/app/server/advisor/advisor.repository";
import { getUserRole, validateCredentials } from "@/app/server/auth/services/auth.service";
import { findStudentByUserId } from "@/app/server/student/student.repository";
import { ROLES } from "@/app/shared/const/role";
import { loginSchema } from "@/app/shared/validations/schema/loginSchema";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        try {
          const result = loginSchema.safeParse(credentials);

          if (!result.success) {
            throw new Error("Bad Request");
          }

          const user = await validateCredentials({
            email: result.data.email,
            password: result.data.password,
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const role = await getUserRole(user.id);

          if (!role) {
            throw new Error("Invalid email or password");
          }

          return { ...user, id: user.id.toString(), role } as User;
        } catch (error) {
          if (error instanceof Error) {
            console.error("Auth error:", error);
          }
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (!token.id) {
          throw new Error("Invalid session");
        }

        const currentRole = await getUserRole(Number(token.id));

        if (!currentRole) {
          throw new Error("Invalid session");
        }

        let advisorType: string | null = null;
        let studyProgram: { id: number; name: string } | null = null;
        let entryYear: number | null = null;

        if (currentRole === ROLES.ADVISOR) {
          const advisor = await findAdvisorByUserId(Number(token.id), {
            type: true,
            studyProgram: { select: { id: true, name: true } },
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          });

          advisorType = advisor?.type ?? null;
          studyProgram = advisor?.studyProgram
            ? { id: advisor.studyProgram.id, name: advisor.studyProgram.name }
            : null;
        }

        if (currentRole === ROLES.STUDENT) {
          const student = await findStudentByUserId(Number(token.id), {
            studyProgramId: true,
            entryYear: true,
            studyProgram: { select: { id: true, name: true } },
          });
          studyProgram = student?.studyProgram
            ? { id: student.studyProgram.id, name: student.studyProgram.name }
            : null;
          entryYear = student?.entryYear ?? null;
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            name: token.name,
            role: token.role,
            advisorType,
            studyProgram,
            entryYear,
          },
        };
      } catch (error) {
        console.error("Session validation error:", error);
        throw error;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
        return `${baseUrl}/dashboard`;
      } catch {
        return `${baseUrl}/dashboard`;
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  debug:
    process.env.NEXT_PUBLIC_ENV_NAME === "development" ||
    process.env.NEXT_PUBLIC_ENV_NAME === "local",
};
