"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/shared/lib/utils";

const STORAGE_KEY = "recipe-chat:bubble-seen-v1";
const APPEAR_DELAY_MS = 800;
const AUTO_HIDE_MS = 6000;

const readSeen = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore (privacy mode)
  }
};

type ChatOnboardingBubbleProps = {
  onClick: () => void;
  isOpen: boolean;
  isAuthenticated: boolean;
  className?: string;
};

const ChatOnboardingBubble = ({
  onClick,
  isOpen,
  isAuthenticated,
  className,
}: ChatOnboardingBubbleProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(false);
      return;
    }
    if (readSeen()) return;

    const appearTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, APPEAR_DELAY_MS);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
      markSeen();
    }, APPEAR_DELAY_MS + AUTO_HIDE_MS);

    return () => {
      window.clearTimeout(appearTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isOpen]);

  const handleBubbleClick = () => {
    setIsVisible(false);
    markSeen();
    onClick();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    markSeen();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ right: "max(1rem, calc((100vw - 550px) / 2 + 1rem))" }}
          className={cn(
            "fixed bottom-[10.5rem] z-sticky max-w-[260px]",
            className
          )}
        >
          <button
            type="button"
            onClick={handleBubbleClick}
            aria-label="레시피 챗봇 열기"
            className="relative flex w-full flex-col items-start gap-1 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-left shadow-xl active:scale-[0.99]"
          >
            <p className="pr-5 text-sm font-semibold leading-6 text-gray-900">
              이 레시피, 궁금한 게 있으면 물어봐 주세요.
            </p>
            {!isAuthenticated && (
              <p className="text-xs text-gray-400">로그인 필요</p>
            )}
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-gray-100 bg-white"
            />
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="말풍선 닫기"
            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatOnboardingBubble;
