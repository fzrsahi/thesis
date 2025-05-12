import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { routes } from "@/constants/auth-routes";

export const withAuth =
  (middleware: NextMiddleware) => async (req: NextRequest, next: NextFetchEvent) => {
    const pathName = req.nextUrl.pathname;
    const currentRoute = routes.find((route) => route.href === pathName);

    if (currentRoute) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

      if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      const advisorRole = token.role as string;
      if (!currentRoute.roles.includes(advisorRole)) {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    return middleware(req, next);
  };
