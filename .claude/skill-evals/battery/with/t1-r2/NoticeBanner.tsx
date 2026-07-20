"use client";

import { X } from "lucide-react";
import { triggerHaptic } from "@/shared/lib/bridge";

type NoticeBannerProps = {
  message: string;
  onDismiss: () => void;
};

const NoticeBanner = ({ message, onDismiss }: NoticeBannerProps) => {
  const handleDismiss = () => {
    triggerHaptic("Light");
    onDismiss();
  };

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3"
    >
      <p className="text-sm text-ink-muted">{message}</p>
      <button
        type="button"
        aria-label="공지 닫기"
        onClick={handleDismiss}
        className="shrink-0 p-1 text-ink-muted"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
};

export default NoticeBanner;
