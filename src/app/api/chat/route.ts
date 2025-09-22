import { NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { CHAT_ERROR_LOG, CHAT_ERROR_RESPONSE } from "@/app/server/chat/chat.error";
import { getLastMessagesForUser } from "@/app/server/chat/chat.repository";
import { chatUseCase } from "@/app/server/chat/chat.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";

export const POST = withAuth(
  async (req: Request, session) => {
    try {
      const { message } = await req.json();
      const encoder = new TextEncoder();
      const data = await chatUseCase(message, Number(session.user.id));

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

export const GET = withAuth(
  async (_req: Request, session) => {
    try {
      const userId = Number(session.user.id);
      const messages = await getLastMessagesForUser(userId);
      return NextResponse.json({
        messages: messages.map((m) => ({
          id: `m_${m.id}`,
          role: m.role === "assistant" ? "ai" : "user",
          content: m.content,
          createdAt: m.createdAt,
        })),
      });
    } catch (err) {
      return internalServerError(err, {
        errorLogMessage: CHAT_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: CHAT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADVISOR, ROLES.ADMIN]
);
