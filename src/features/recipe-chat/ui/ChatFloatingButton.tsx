"use client";

import { Bot } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type ChatFloatingButtonProps = {
  onClick: () => void;
  className?: string;
};

const ChatFloatingButton = ({ onClick, className }: ChatFloatingButtonProps) => {
  const handleClick = () => {
    triggerHaptic("Light");
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="레시피 챗봇 열기"
      style={{ right: "max(1rem, calc((100vw - 550px) / 2 - 4.5rem))" }}
      className={cn(
        "fixed bottom-44 md:bottom-24 z-sticky flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-olive-light text-white shadow-xl transition-all hover:shadow-2xl active:scale-[0.95]",
        className
      )}
    >
      <Bot className="h-6 w-6" />
      <span
        aria-hidden
        className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"
      />
    </button>
  );
};

export default ChatFloatingButton;
