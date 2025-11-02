"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useChat } from "./hooks/useChat";

// Markdown components moved outside to avoid nested component warnings
const createMarkdownComponents = (
  isLight: boolean,
  tableBorder: string,
  cellBorder: string
): Components => ({
  table: (props) => (
    <table {...props} className={cn("w-full border-collapse [&_*]:align-top", tableBorder)} />
  ),
  thead: (props) => (
    <thead
      {...props}
      className={cn(
        "text-left",
        isLight ? "bg-[#F6E9DB] text-[#2F2A24]" : "bg-zinc-900/60 text-white"
      )}
    />
  ),
  tbody: (props) => (
    <tbody
      {...props}
      className={cn(isLight ? "divide-y divide-stone-200" : "divide-y divide-zinc-700/60")}
    />
  ),
  tr: (props) => (
    <tr
      {...props}
      className={cn(
        "transition-colors",
        isLight ? "hover:bg-[#F4E4D4]/60" : "hover:bg-zinc-800/40"
      )}
    />
  ),
  th: (props) => (
    <th
      {...props}
      className={cn(
        "px-3 py-2 text-sm font-semibold",
        isLight ? `border ${cellBorder} text-[#2F2A24]` : `border ${cellBorder} text-zinc-200`
      )}
    />
  ),
  td: (props) => (
    <td
      {...props}
      className={cn(
        "px-3 py-2 text-sm",
        isLight ? `border ${cellBorder} text-[#5C5245]` : `border ${cellBorder} text-zinc-300`
      )}
    />
  ),
  code: ({ children, ...props }) => (
    <code
      {...props}
      className={cn(
        "rounded px-1.5 py-0.5 text-[0.9em]",
        isLight ? "bg-[#F4E4D4] text-[#2F2A24]" : "bg-zinc-800/80 text-zinc-200"
      )}
    >
      {children}
    </code>
  ),
  pre: (props) => (
    <pre
      {...props}
      className={cn(
        "overflow-auto rounded-lg border p-3 text-sm",
        isLight ? "border-stone-300 bg-white" : "border-zinc-700 bg-zinc-900/70 text-zinc-200"
      )}
    />
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      className={cn(
        "underline underline-offset-2 transition-colors",
        isLight
          ? "text-[#E36C3A] decoration-[#E36C3A]/40 hover:text-[#D65A27] hover:decoration-[#D65A27]"
          : "text-blue-400 decoration-blue-400/40 hover:decoration-blue-400"
      )}
    >
      {children}
    </a>
  ),
  ul: (props) => (
    <ul
      {...props}
      className={cn("list-disc pl-5", isLight ? "marker:text-[#C4A68B]" : "marker:text-zinc-500")}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "list-decimal pl-5",
        isLight ? "marker:text-[#C4A68B]" : "marker:text-zinc-500"
      )}
    />
  ),
  li: (props) => (
    <li {...props} className={cn("my-1", isLight ? "text-[#5C5245]" : "text-zinc-300")} />
  ),
});

const MyChatPage = () => {
  const { messages, input, isSending, setInput, sendMessage, stopChat, isTyping } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isTyping]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) {
      setIsLight(stored === "light");
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent)?.detail as { theme?: string } | undefined;
      if (!detail?.theme) return;
      setIsLight(detail.theme === "light");
    };

    window.addEventListener("scout-theme-change", handler as EventListener);
    return () => window.removeEventListener("scout-theme-change", handler as EventListener);
  }, []);

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const userAvatarClass = isLight ? "bg-[#E36C3A] text-white" : "bg-zinc-700 text-white";
  const aiAvatarClass = isLight ? "bg-[#2F2A24] text-white" : "bg-zinc-800 text-white";
  const userBubbleClass = isLight
    ? "bg-[#F4E4D4] border border-stone-300 text-[#2F2A24]"
    : "bg-zinc-700/70 text-white";
  const aiBubbleClass = isLight
    ? "bg-white/90 border border-stone-300 text-[#2F2A24]"
    : "bg-zinc-800/70 text-zinc-200";
  const typingBubbleClass = isLight ? "bg-white/85 border border-stone-300" : "bg-zinc-800/70";
  const inputClass = isLight
    ? "flex-1 rounded-lg border border-stone-300 bg-white/90 px-4 py-2.5 text-sm text-[#2F2A24] outline-none transition-colors focus:border-stone-400 focus:ring-2 focus:ring-stone-300/40"
    : "flex-1 rounded-lg border border-zinc-700/50 bg-zinc-800/70 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600";
  const stopButtonClass = isLight
    ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
    : "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500";
  const sendButtonClass = isLight
    ? "rounded-lg bg-gradient-to-r from-[#F6A964] to-[#E36C3A] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:brightness-105 disabled:opacity-60"
    : "rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-60";
  const typingDotClass = isLight ? "bg-[#7A6B5B]" : "bg-zinc-400";

  const tableBorder = isLight ? "border border-stone-300" : "border border-zinc-700";
  const cellBorder = isLight ? "border-stone-200" : "border-zinc-700";

  const mdComponents = useMemo<Components>(
    () => createMarkdownComponents(isLight, tableBorder, cellBorder),
    [cellBorder, isLight, tableBorder]
  );

  const proseClass = cn(
    "max-w-none",
    isLight
      ? "prose prose-headings:text-[#2F2A24] prose-p:text-[#5C5245] prose-strong:text-[#2F2A24] prose-code:text-[#2F2A24]"
      : "prose prose-invert prose-headings:text-white prose-p:text-zinc-300 prose-li:marker:text-zinc-500"
  );

  return (
    <div className={cn("space-y-6 transition-colors duration-300", textPrimary)}>
      <div>
        <h1 className={cn("mb-2 text-2xl font-bold", textPrimary)}>Mengobrol Dengan Asisten AI</h1>
        <p className={cn("mb-6 max-w-2xl text-sm md:text-base", textSecondary)}>
          Silakan gunakan fitur chat ini untuk bertanya atau berdiskusi seputar data dan informasi
          kompetisi. Asisten AI siap membantu kebutuhan Anda terkait kompetisi mahasiswa!
        </p>
      </div>

      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-4", m.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                m.role === "user" ? userAvatarClass : aiAvatarClass
              )}
            >
              {m.role === "user" ? "You" : "AI"}
            </div>
            <div
              className={cn(
                "flex-1 rounded-xl p-4 shadow-sm transition-colors",
                m.role === "user" ? userBubbleClass : aiBubbleClass
              )}
            >
              {m.role === "user" ? (
                <p className={cn("text-sm", textPrimary)}>{m.content}</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className={proseClass}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isSending && !isTyping && (
          <div className="flex gap-4">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                aiAvatarClass
              )}
            >
              AI
            </div>
            <div
              className={cn("flex items-center space-x-2 rounded-xl px-4 py-3", typingBubbleClass)}
              aria-label="AI sedang mengetik"
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 animate-bounce rounded-full",
                  typingDotClass,
                  "[animation-delay:-0.3s]"
                )}
              />
              <span
                className={cn(
                  "inline-block h-2 w-2 animate-bounce rounded-full",
                  typingDotClass,
                  "[animation-delay:-0.15s]"
                )}
              />
              <span
                className={cn("inline-block h-2 w-2 animate-bounce rounded-full", typingDotClass)}
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-8">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik pesan..."
            className={inputClass}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (isSending || isTyping) {
                  stopChat();
                  inputRef.current?.focus();
                } else {
                  Promise.resolve(sendMessage())
                    .then(() => {
                      inputRef.current?.focus();
                    })
                    .catch(() => {});
                }
              }
            }}
          />

          {isSending || isTyping ? (
            <Button
              type="button"
              className={stopButtonClass}
              onClick={() => {
                stopChat();
                inputRef.current?.focus();
              }}
            >
              Stop
            </Button>
          ) : (
            <Button
              type="button"
              className={sendButtonClass}
              onClick={() => {
                Promise.resolve(sendMessage())
                  .then(() => {
                    inputRef.current?.focus();
                  })
                  .catch(() => {});
              }}
            >
              Kirim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyChatPage;
