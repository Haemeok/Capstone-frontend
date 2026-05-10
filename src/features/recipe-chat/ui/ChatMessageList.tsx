import { useEffect, useRef } from "react";

import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

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
  // Android에서 키보드 높이 변할 때도 마지막 메시지로 스크롤 유지.
  // iOS는 visualViewport 자동 보정이라 store 값 0 유지 → 영향 없음.
  const keyboardHeight = useKeyboardStore((s) => s.keyboardHeight);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, keyboardHeight]);

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
