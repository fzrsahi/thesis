import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { ROLES } from "@/app/shared/const/role";

export const GET = async () => NextResponse.json({ message: "Hello, world!" });

// Contoh penggunaan withAuth untuk route yang memerlukan autentikasi
export const POST = withAuth(
  async (req, session) => {
    try {
      // Akses data user dari session
      const userId = session.user.id;
      const userRole = session.user.role;
      const userEmail = session.user.email;

      // Contoh logic bisnis
      const responseData = {
        message: "Data berhasil diproses",
        user: {
          id: userId,
          role: userRole,
          email: userEmail,
        },
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(responseData, {
        status: HttpStatusCode.Ok,
      });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Terjadi kesalahan server" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  },
  [ROLES.STUDENT, ROLES.ADVISOR, ROLES.ADMIN] // Role yang diizinkan
);
