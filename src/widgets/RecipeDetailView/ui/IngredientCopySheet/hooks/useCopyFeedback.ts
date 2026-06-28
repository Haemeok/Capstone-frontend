"use client";

import { useRef, useState } from "react";

import { useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

const COPIED_FEEDBACK_DURATION_MS = 1500;

export const useCopyFeedback = () => {
  const { addToast } = useToastStore();
  const t = useT();
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
      addToast({ message: t.ingredientSheet.copyFailed, variant: "error" });
    }
  };

  return { isCopied, copy };
};
