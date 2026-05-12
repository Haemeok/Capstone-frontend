"use client";

import { XCircle } from "lucide-react";

type ErrorStateProps = {
  message?: string;
  onDismiss: () => void;
};

export const ErrorState = ({ message, onDismiss }: ErrorStateProps) => (
  <>
    <XCircle className="mx-auto h-10 w-10 text-red-400" />
    <p className="mt-2 break-keep text-xs font-semibold text-white">
      {message || "실패"}
    </p>
    <button
      onClick={(e) => {
        e.preventDefault();
        onDismiss();
      }}
      aria-label="에러 닫기"
      className="mt-2 cursor-pointer text-xs text-white/80 underline hover:text-white"
    >
      닫기
    </button>
  </>
);
