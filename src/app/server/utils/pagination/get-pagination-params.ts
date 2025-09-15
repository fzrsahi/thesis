import { NextRequest } from "next/server";

import { PaginationParams } from "./pagination.types";

export const getPaginationParams = (req: NextRequest): PaginationParams => {
  const { searchParams } = req.nextUrl;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const keywordsParam = searchParams.get("keywords");

  const page = pageParam ? Number(pageParam) : null;
  const limit = limitParam ? Number(limitParam) : null;
  const keywords = keywordsParam ? String(keywordsParam) : null;

  return { page, limit, keywords };
};
