"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { ApiError, getErrorData } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { useUserStore } from "@/entities/user/model/store";

import { useToastStore } from "@/widgets/Toast";

import {
  CHAT_ERROR_BEHAVIOR,
  getChatErrorBehavior,
} from "../model/errorMessages";
import { useChatMutation, useChatQuotaQuery } from "../model/hooks";
import type { ChatErrorCode, ChatMessage, ChatResponse } from "../model/types";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

const KNOWN_CODES = Object.keys(CHAT_ERROR_BEHAVIOR) as ChatErrorCode[];

const isPendingMessage = (m: ChatMessage) =>
  m.role === "assistant" && "status" in m && m.status === "pending";

const resolveChatErrorCode = (err: ApiError): ChatErrorCode => {
  const data = getErrorData(err);
  if (data?.code == null) {
    // No recognizable error envelope — likely shape drift from backend.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[recipe-chat] missing error code in response", err.data);
    }
    return "710";
  }
  const raw = String(data.code);
  return (KNOWN_CODES as string[]).includes(raw)
    ? (raw as ChatErrorCode)
    : "710";
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

type ChatDrawerProps = {
  recipeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const ChatDrawer = ({ recipeId, isOpen, onOpenChange }: ChatDrawerProps) => {
  const { Container, Content, Title } = useResponsiveSheet();
  const { isAuthenticated } = useUserStore();
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stickyLockCode, setStickyLockCode] = useState<ChatErrorCode | null>(
    null
  );
  const sessionIdRef = useRef(newId());

  const { mutate } = useChatMutation();
  const { data: quota } = useChatQuotaQuery({
    enabled: isOpen && isAuthenticated,
  });

  const isQuotaExhausted = !!quota && quota.remaining === 0;
  const lockedFromError =
    stickyLockCode === "705" ||
    stickyLockCode === "706" ||
    stickyLockCode === "207";
  const isLocked = isQuotaExhausted || lockedFromError;

  const lockedReason = useMemo(() => {
    if (stickyLockCode === "706") return "챗봇이 일시 중지되었어요";
    if (stickyLockCode === "207") return "작성자만 사용할 수 있어요";
    if (isQuotaExhausted || stickyLockCode === "705")
      return "오늘 한도를 다 썼어요. 내일 자정 리셋";
    return null;
  }, [stickyLockCode, isQuotaExhausted]);

  const fallbackView = useMemo(() => {
    if (stickyLockCode === "706" || stickyLockCode === "207") {
      const b = getChatErrorBehavior(stickyLockCode);
      return b.fallbackView ?? null;
    }
    return null;
  }, [stickyLockCode]);

  const replaceLastPending = useCallback((next: ChatMessage) => {
    setMessages((prev) => {
      const lastIdx = [...prev].reverse().findIndex(isPendingMessage);
      if (lastIdx === -1) return [...prev, next];
      const realIdx = prev.length - 1 - lastIdx;
      return [...prev.slice(0, realIdx), next, ...prev.slice(realIdx + 1)];
    });
  }, []);

  const runMutation = useCallback(
    (question: string) => {
      mutate(
        { recipeId, question, sessionId: sessionIdRef.current },
        {
          onSuccess: (res: ChatResponse) => {
            replaceLastPending({
              id: newId(),
              role: "assistant",
              text: res.answer,
              fromLlm: res.fromLlm,
              intent: res.intent,
            });
            triggerHaptic("Light");
          },
          onError: (err) => {
            const code = resolveChatErrorCode(err);
            const behavior = getChatErrorBehavior(code);

            replaceLastPending({
              id: newId(),
              role: "system",
              code,
              retryable: !!behavior.retryable,
              sourceQuestion: question,
            });

            if (behavior.toast) {
              addToast({
                message: behavior.toast.message,
                variant: behavior.toast.variant,
                position: "bottom",
              });
            }
            if (behavior.haptic) triggerHaptic(behavior.haptic);
            if (behavior.inputLock) setStickyLockCode(code);
            if (behavior.closeDrawer) onOpenChange(false);
          },
        }
      );
    },
    [recipeId, mutate, replaceLastPending, addToast, onOpenChange]
  );

  const sendQuestion = useCallback(
    (question: string) => {
      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        text: question,
      };
      const pendingMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        status: "pending",
      };
      setMessages((prev) => [
        ...prev.map((m) =>
          m.role === "system" && m.retryable
            ? { ...m, retryable: false }
            : m
        ),
        userMsg,
        pendingMsg,
      ]);
      runMutation(question);
    },
    [runMutation]
  );

  const handleRetry = useCallback(
    (sourceQuestion: string) => {
      setMessages((prev) => {
        const lastIdx = [...prev]
          .reverse()
          .findIndex(
            (m) =>
              m.role === "system" &&
              m.retryable &&
              m.sourceQuestion === sourceQuestion
          );
        if (lastIdx === -1) return prev;
        const realIdx = prev.length - 1 - lastIdx;
        const pendingMsg: ChatMessage = {
          id: newId(),
          role: "assistant",
          status: "pending",
        };
        return [
          ...prev.slice(0, realIdx),
          pendingMsg,
          ...prev.slice(realIdx + 1),
        ];
      });
      runMutation(sourceQuestion);
    },
    [runMutation]
  );

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
        <Title className="sr-only">레시피 챗봇</Title>
        <div className="flex h-[80vh] max-h-[640px] flex-col sm:h-[70vh]">
          <ChatHeader quota={quota} onClose={() => onOpenChange(false)} />
          {fallbackView ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <p className="text-lg font-bold text-gray-900">
                {fallbackView.title}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {fallbackView.description}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ChatMessageList
                messages={messages}
                onRetry={handleRetry}
                onQuickQuestion={
                  isAuthenticated && !isLocked ? sendQuestion : undefined
                }
              />
            </div>
          )}
          <ChatInput
            isAuthenticated={isAuthenticated}
            isPending={messages.some(isPendingMessage)}
            isLocked={isLocked}
            lockedReason={lockedReason}
            onSubmit={sendQuestion}
          />
        </div>
      </Content>
    </Container>
  );
};

export default ChatDrawer;
