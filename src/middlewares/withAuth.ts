import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { ROLES, Role } from "@/app/shared/const/role";
import { routes } from "@/constants/auth-routes";
import { Route } from "@/constants/auth-routes.type";

export const withAuth =
  (middleware: NextMiddleware) => async (req: NextRequest, next: NextFetchEvent) => {
    const pathName = req.nextUrl.pathname;
    const currentRoute = routes.find((route) => route.href === pathName) as Route | undefined;

    if (currentRoute) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

      if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      const userRole = token.role as Role;

      if (userRole === ROLES.STUDENT && pathName.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (!currentRoute.roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    return middleware(req, next);
  };
