import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserRole, validateCredentials } from "@/app/server/auth/services/auth.service";
import { loginSchema } from "@/app/shared/validations/schema/loginSchema";

const authOptions: NextAuthOptions = {
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
          throw new Error("Email atau password salah");
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
            throw new Error("Email atau password salah");
          }

          const role = await getUserRole(user.id);

          if (!role) {
            throw new Error("Terjadi Kesalahan Server");
          }

          return { ...user, id: user.id.toString(), role } as User;
        } catch (error) {
          if (error instanceof Error) {
            console.error("Auth error:", error);
          }
          console.error("Auth error:", error);
          throw new Error("Terjadi Kesalahan Server");
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
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        },
      };
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
  debug: process.env.NEXT_PUBLIC_ENV_NAME === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
