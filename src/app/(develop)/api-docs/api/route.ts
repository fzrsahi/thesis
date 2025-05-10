import { NextResponse } from "next/server";

import openapi from "@/app/api-docs/openapi.json";

const isDev = process.env.NEXT_PUBLIC_ENV_NAME === "development";

export const GET = async () => {
  if (!isDev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(openapi);
};
