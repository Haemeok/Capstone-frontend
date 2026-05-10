import { useEffect, useRef } from "react";

import type { ChatMessage } from "../model/types";

import ChatEmptyState from "./ChatEmptyState";
import ChatMessageBubble from "./ChatMessageBubble";

type ChatMessageListProps = {
  messages: ChatMessage[];
  onRetry: (sourceQuestion: string) => void;
  onQuickQuestion?: (question: string) => void;
};

const ChatMessageList = ({
  messages,
  onRetry,
  onQuickQuestion,
}: ChatMessageListProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0)
    return <ChatEmptyState onQuickQuestion={onQuickQuestion} />;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="챗봇 대화 내역"
      className="flex flex-col gap-3 px-4 py-3"
    >
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} onRetry={onRetry} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ChatMessageList;
