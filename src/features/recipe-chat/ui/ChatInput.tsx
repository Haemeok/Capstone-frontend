"use client";

import { FormEvent, useState } from "react";

import { Send } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { useInputFocusStore } from "@/shared/store/useInputFocusStore";

import { useLoginEncourageDrawerStore } from "@/widgets/LoginEncourageDrawer/model/store";

const MAX_LENGTH = 500;
const COUNTER_WARN_THRESHOLD = 450;
const UNAUTH_DRAWER_MESSAGE = "레시피 챗봇에게 물어보세요!";

type ChatInputProps = {
  isAuthenticated: boolean;
  isPending: boolean;
  isLocked: boolean;
  lockedReason: string | null;
  onSubmit: (text: string) => void;
};

const ChatInput = ({
  isAuthenticated,
  isPending,
  isLocked,
  lockedReason,
  onSubmit,
}: ChatInputProps) => {
  const [text, setText] = useState("");
  const { setInputFocused } = useInputFocusStore();
  const { openDrawer } = useLoginEncourageDrawerStore();

  const isInteractionDisabled = isPending || isLocked;
  const trimmed = text.trim();
  const canSubmit = isAuthenticated && !isInteractionDisabled && trimmed.length > 0;

  const handleUnauthAccess = () => {
    triggerHaptic("Light");
    openDrawer({ message: UNAUTH_DRAWER_MESSAGE });
  };

  const submit = () => {
    if (!canSubmit) return;
    triggerHaptic("Light");
    onSubmit(trimmed);
    setText("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isAuthenticated) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleUnauthIntercept = (e: React.SyntheticEvent) => {
    if (isAuthenticated) return;
    e.preventDefault();
    handleUnauthAccess();
  };

  const handleSendClick = () => {
    if (!isAuthenticated) {
      handleUnauthAccess();
      return;
    }
    submit();
  };

  const placeholder = isLocked
    ? (lockedReason ?? "지금은 사용할 수 없어요")
    : isPending
      ? "답변 작성 중..."
      : "이 레시피에 대해서 어떤 게 궁금하신가요?";

  const counterColor =
    text.length >= COUNTER_WARN_THRESHOLD ? "text-red-500" : "text-gray-400";

  const sendEnabledStyle =
    isAuthenticated && !canSubmit
      ? "cursor-not-allowed bg-gray-100 text-gray-300"
      : "cursor-pointer bg-olive-light text-white hover:bg-olive-dark";

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 bg-white px-4 py-3"
    >
      <div
        data-testid="chat-input-wrapper"
        className={cn(
          "flex items-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 transition-colors",
          isAuthenticated && !isInteractionDisabled &&
            "focus-within:border-olive-light focus-within:ring-1 focus-within:ring-olive-light"
        )}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (isAuthenticated) setInputFocused(true); }}
          onBlur={() => { if (isAuthenticated) setInputFocused(false); }}
          onMouseDown={handleUnauthIntercept}
          onTouchStart={handleUnauthIntercept}
          readOnly={!isAuthenticated}
          disabled={isInteractionDisabled}
          placeholder={placeholder}
          rows={1}
          maxLength={MAX_LENGTH}
          className="flex-1 resize-none bg-transparent py-1 text-base leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleSendClick}
          disabled={isAuthenticated && !canSubmit}
          aria-label="질문 전송"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
            sendEnabledStyle
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {isAuthenticated &&
        !isLocked &&
        text.length >= COUNTER_WARN_THRESHOLD && (
          <p className={cn("mt-1 text-right text-xs", counterColor)}>
            {text.length} / {MAX_LENGTH}
          </p>
        )}
      <p className="mt-2 text-center text-[11px] text-gray-400">
        레시피오 AI는 실수할 수 있어요
      </p>
    </form>
  );
};

export default ChatInput;
