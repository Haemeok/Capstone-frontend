"use client";

import { useRef, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useToastStore } from "@/widgets/Toast";

const COPIED_FEEDBACK_DURATION_MS = 1500;

export const useCopyFeedback = () => {
  const { addToast } = useToastStore();
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef<NodeJS.Timeout | null>(null);

  const copy = async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      triggerHaptic("Success");
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      setIsCopied(true);
      copiedTimerRef.current = setTimeout(
        () => setIsCopied(false),
        COPIED_FEEDBACK_DURATION_MS
      );
    } catch {
      addToast({ message: "복사에 실패했습니다.", variant: "error" });
    }
  };

  return { isCopied, copy };
};
