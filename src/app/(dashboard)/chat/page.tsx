"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { useChat } from "@/app/(home)/(student)/my-chat/hooks/useChat";
import Button from "@/components/ui/button";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

const mdComponents: Components = {
  table: (props) => (
    <table {...props} className="w-full border-collapse border border-zinc-700 [&_*]:align-top" />
  ),
  thead: (props) => <thead {...props} className="bg-zinc-900/60" />,
  tbody: (props) => <tbody {...props} className="divide-y divide-zinc-700/60" />,
  tr: (props) => <tr {...props} className="hover:bg-zinc-800/40" />,
  th: (props) => (
    <th {...props} className="border border-zinc-700 px-3 py-2 text-left text-zinc-200" />
  ),
  td: (props) => <td {...props} className="border border-zinc-700 px-3 py-2 text-zinc-300" />,
  code: ({ children, ...props }) => (
    <code {...props} className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[0.9em] text-zinc-200">
      {children}
    </code>
  ),
  pre: (props) => (
    <pre
      {...props}
      className="overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/70 p-3 text-zinc-200"
    />
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      className="text-blue-400 underline decoration-blue-400/40 underline-offset-2 hover:decoration-blue-400"
    >
      {children}
    </a>
  ),
  ul: (props) => <ul {...props} className="list-disc pl-5 marker:text-zinc-500" />,
  ol: (props) => <ol {...props} className="list-decimal pl-5 marker:text-zinc-500" />,
  li: (props) => <li {...props} className="my-1" />,
};

const AdminChatPage = () => {
  const { messages, input, isSending, setInput, sendMessage, stopChat, isTyping } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isTyping]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <BookOpen className="h-10 w-10 font-extrabold" />
          Chat Admin
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Chat dengan endpoint dan logika yang sama seperti halaman student.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="w-full rounded-xl border-2 border-zinc-700 bg-zinc-900 p-4 text-white shadow-lg">
        <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "flex flex-row-reverse gap-4" : "flex gap-4"}
            >
              <div
                className={
                  m.role === "user"
                    ? "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs"
                    : "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs"
                }
              >
                {m.role === "user" ? "You" : "AI"}
              </div>
              <div
                className={
                  m.role === "user"
                    ? "flex-1 rounded-xl bg-zinc-700/70 p-4"
                    : "flex-1 rounded-xl bg-zinc-800/70 p-4"
                }
              >
                {m.role === "user" ? (
                  <p className="text-sm text-white">{m.content}</p>
                ) : (
                  <div className="prose prose-invert prose-headings:text-white prose-p:text-zinc-300 prose-li:marker:text-zinc-500 max-w-none">
                    <div className="overflow-x-auto">
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
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs">
                AI
              </div>
              <div
                className="flex items-center space-x-2 rounded-xl bg-zinc-800/70 px-4 py-3"
                aria-label="AI sedang mengetik"
              >
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="mt-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ketik pesan..."
              className="flex-1 rounded-lg border border-zinc-700/50 bg-zinc-800/70 px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600"
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
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
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
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600 disabled:opacity-50"
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
    </div>
  );
};

export default AdminChatPage;
