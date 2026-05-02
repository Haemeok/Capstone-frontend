import { RefreshCw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { SYSTEM_BUBBLE_LABEL } from "../model/errorMessages";
import type { ChatMessage } from "../model/types";

import ChatMarkdown from "./ChatMarkdown";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  onRetry?: (sourceQuestion: string) => void;
};

const BotAvatar = () => (
  <Image
    src="/web-app-manifest-192x192.png"
    alt="Recipio"
    width={28}
    wrapperClassName="mt-0.5 shrink-0 rounded-lg"
  />
);

const ChatMessageBubble = ({ message, onRetry }: ChatMessageBubbleProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-olive-light px-4 py-2.5 text-white">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  }

  if (message.role === "assistant" && "status" in message && message.status === "pending") {
    return (
      <div className="flex items-start justify-start gap-2">
        <BotAvatar />
        <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
          <PendingDots />
        </div>
      </div>
    );
  }

  if (message.role === "assistant" && "text" in message) {
    return (
      <div className="flex items-start justify-start gap-2">
        <BotAvatar />
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5",
            message.fromLlm ? "text-gray-900" : "text-gray-700"
          )}
        >
          {message.fromLlm ? (
            <ChatMarkdown text={message.text} />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          )}
        </div>
      </div>
    );
  }

  if (message.role === "system") {
    const label = SYSTEM_BUBBLE_LABEL[message.code];
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <p>{label}</p>
          {message.retryable && message.sourceQuestion && onRetry && (
            <button
              type="button"
              onClick={() => onRetry(message.sourceQuestion!)}
              className="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200"
            >
              <RefreshCw className="h-3 w-3" />
              다시 시도
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

const PendingDots = () => (
  <div className="flex items-center gap-1">
    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
  </div>
);

export default ChatMessageBubble;
