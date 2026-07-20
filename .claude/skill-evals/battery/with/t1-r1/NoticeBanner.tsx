"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { triggerHaptic } from "@/shared/lib/bridge";

type NoticeBannerProps = {
  message: string;
  onDismiss?: () => void;
};

export const NoticeBanner = ({ message, onDismiss }: NoticeBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    triggerHaptic("light");
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 rounded-lg bg-beige px-4 py-3"
    >
      <p className="text-sm text-ink-muted">{message}</p>
      <button
        type="button"
        aria-label="공지 닫기"
        onClick={handleDismiss}
        className="shrink-0 p-1 text-ink-muted"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};
