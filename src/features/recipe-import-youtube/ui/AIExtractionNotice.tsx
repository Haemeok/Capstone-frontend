"use client";

import { useEffect, useState } from "react";

import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "ai-extraction-notice-dismissed";

export const AIExtractionNotice = () => {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  if (isDismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-olive-light/5 px-4 py-3.5">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-olive-light" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-700">
          AI가 추출한 재료예요
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
          영상 속 정보를 기반으로 추출했어요. 재료명이나 수량이 실제와 다를 수
          있으니 영상과 함께 확인해주세요.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 cursor-pointer p-1 text-gray-300 hover:text-gray-500 transition-colors"
        aria-label="안내 닫기"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
