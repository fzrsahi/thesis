import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest) =>
  NextResponse.json({
    success: true,
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      student_id: "12345678",
    },
  });
