"use client";

import { Loader2, RefreshCw } from "lucide-react";

type CookingRecordDetailStatusProps = {
  status: "loading" | "error";
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  onRetry: () => void;
};

export const CookingRecordDetailStatus = ({
  status,
  loadingLabel,
  errorLabel,
  retryLabel,
  onRetry,
}: CookingRecordDetailStatusProps) => (
  <div
    aria-live="polite"
    className="flex min-h-72 flex-1 flex-col items-center justify-center px-6 text-center"
  >
    {status === "loading" ? (
      <>
        <Loader2
          aria-hidden="true"
          className="text-ink-muted size-6 animate-spin"
        />
        <p className="text-ink-sub mt-3 text-sm">{loadingLabel}</p>
      </>
    ) : (
      <>
        <p className="text-ink-sub text-sm">{errorLabel}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-ink focus-visible:outline-olive-dark mt-4 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {retryLabel}
        </button>
      </>
    )}
  </div>
);
