"use client";

import dynamic from "next/dynamic";

const ChatMarkdown = dynamic(
  () => import("@/features/recipe-chat/ui/ChatMarkdown"),
  { ssr: false },
);

export const MarkdownPreview = ({ markdown }: { markdown: string }) => (
  <section className="rounded border p-3">
    <h2 className="text-sm font-bold mb-2">미리보기</h2>
    <ChatMarkdown text={markdown} />
  </section>
);
