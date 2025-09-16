import { NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { chatUseCase } from "@/app/server/chat/chat.usecase";
import { ROLES } from "@/app/shared/const/role";

export const POST = withAuth(
  async (req: Request, _session) => {
    try {
      const { message } = await req.json();
      const encoder = new TextEncoder();
      const data = await chatUseCase(message);

      const stream = new ReadableStream({
        start(controller) {
          try {
            const dataStream = `event: message\ndata: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(dataStream));
          } catch (e) {
            console.error(e);
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      return NextResponse.json({ error: "Request cancelled" }, { status: 499 });
    }
  },
  [ROLES.STUDENT, ROLES.ADVISOR, ROLES.ADMIN]
);
