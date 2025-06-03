import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (_request: NextRequest) =>
    NextResponse.json({
      message: "Hello, world!",
    }),
  [ROLES.STUDENT]
);
