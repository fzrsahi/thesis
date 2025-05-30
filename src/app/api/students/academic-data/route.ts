import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest) =>
  NextResponse.json({
    success: true,
    data: {
      gpa: "3.5",
      transcript_url: "https://example.com/transcript",
      interests: ["Interest 1", "Interest 2", "Interest 3"],
      achievements: [
        {
          title: "Achievement 1",
          description: "Description 1",
          date: "2021-01-01",
        },
      ],
      experiences: [
        {
          organization: "Organization 1",
          position: "Position 1",
          start_date: "2021-01-01",
          end_date: "2021-01-01",
        },
      ],
    },
  });
