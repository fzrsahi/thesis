"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // typing effect
  const [typingBuffer, setTypingBuffer] = useState<string | null>(null);
  const typingIndexRef = useRef(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // abort controller for active request
  const controllerRef = useRef<AbortController | null>(null);

  const clearTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    typingIndexRef.current = 0;
    setTypingBuffer(null);
  }, []);

  useEffect(() => {
    if (typingBuffer == null) return () => {};

    // Inject placeholder AI message once, then update it as we type
    setMessages((prev) => [...prev, { id: `ai_${Date.now()}`, role: "ai", content: "" }]);
    typingIndexRef.current = 0;

    typingTimerRef.current = setInterval(() => {
      typingIndexRef.current += 1;
      const next = typingBuffer.slice(0, typingIndexRef.current);
      setMessages((prev) => {
        const copy = [...prev];
        const lastIndex = copy.length - 1;
        if (lastIndex >= 0 && copy[lastIndex].role === "ai") {
          copy[lastIndex] = { ...copy[lastIndex], content: next };
        }
        return copy;
      });

      if (typingIndexRef.current >= typingBuffer.length) {
        clearTyping();
      }
    }, 6);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [typingBuffer, clearTyping]);

  const stopChat = useCallback(() => {
    // Abort active request
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    // Stop typing animation and reset flags
    clearTyping();
    setIsSending(false);
  }, [clearTyping]);

  // Load last 10 messages on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/chat", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load messages");
        const data = (await res.json()) as {
          messages: { id: string; role: "ai" | "user"; content: string }[];
        };
        if (!mounted) return;
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([
            {
              id: `init_${Date.now()}`,
              role: "ai",
              content: "Halo, bagaimana saya bisa membantu Anda hari ini?",
            },
          ]);
        }
      } catch {
        if (!mounted) return;
        setMessages([
          {
            id: `init_${Date.now()}`,
            role: "ai",
            content: "Halo, bagaimana saya bisa membantu Anda hari ini?",
          },
        ]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isSending) return;
    const userText = input.trim();
    setInput("");
    setIsSending(true);

    setMessages((prev) => [...prev, { id: `user_${Date.now()}`, role: "user", content: userText }]);

    try {
      // Prepare abort controller
      const controller = new AbortController();
      controllerRef.current = controller;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Gagal terhubung ke layanan chat");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const readStream = (): Promise<void> =>
        reader.read().then(({ value, done }) => {
          if (done) return Promise.resolve();

          buffer += decoder.decode(value, { stream: true });

          let sepIndex = buffer.indexOf("\n\n");
          while (sepIndex !== -1) {
            const rawEvent = buffer.slice(0, sepIndex);
            buffer = buffer.slice(sepIndex + 2);

            const lines = rawEvent.split("\n");
            let eventType: string | null = null;
            let dataLine: string | null = null;
            for (let i = 0; i < lines.length; i += 1) {
              const line = lines[i];
              if (line.startsWith("event:")) eventType = line.replace("event:", "").trim();
              else if (line.startsWith("data:")) dataLine = line.replace("data:", "").trim();
            }

            if (eventType === "message" && dataLine) {
              try {
                const payload = JSON.parse(dataLine) as { id: string; content: string };
                setTypingBuffer(payload.content || "");
              } catch {
                // ignore malformed event
              }
            }

            sepIndex = buffer.indexOf("\n\n");
          }

          return readStream();
        });

      await readStream();
    } catch (err) {
      // Ignore abort errors; show generic error for others
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "ai",
            content: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
          },
        ]);
      }
    } finally {
      setIsSending(false);
      controllerRef.current = null;
    }
  }, [input, isSending]);

  return {
    messages,
    input,
    isSending,
    setInput,
    sendMessage,
    stopChat,
    isTyping: typingBuffer != null,
  } as const;
};
