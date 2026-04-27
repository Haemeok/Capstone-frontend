"use client";

import { MessageCircle } from "lucide-react";

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
      className={cn(
        "fixed bottom-24 right-4 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-olive-light text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.95]",
        className
      )}
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default ChatFloatingButton;
