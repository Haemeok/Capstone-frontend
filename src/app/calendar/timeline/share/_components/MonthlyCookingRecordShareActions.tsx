"use client";

import { Download, Loader2, RotateCcw, Share2 } from "lucide-react";

import type { MonthlyCookingRecordImageStatus } from "@/features/monthly-cooking-record-share";

import type { MonthlyCookingRecordShareCopy } from "./sharePage.types";

type MonthlyCookingRecordShareActionsProps = {
  status: MonthlyCookingRecordImageStatus;
  pendingAction: "saveImage" | "shareImage" | null;
  copy: MonthlyCookingRecordShareCopy;
  onSave: () => void;
  onShare: () => void;
  onRetry: () => void;
};

export const MonthlyCookingRecordShareActions = ({
  status,
  pendingAction,
  copy,
  onSave,
  onShare,
  onRetry,
}: MonthlyCookingRecordShareActionsProps) => (
  <div className="z-header fixed right-0 bottom-0 left-0 bg-white/96">
    <div className="mx-auto max-w-lg px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      {status === "error" ? (
        <div className="grid gap-2">
          <p role="status" className="text-ink-muted text-center text-xs">
            {copy.generationError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="bg-ink focus-visible:outline-ink flex min-h-13 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <RotateCcw aria-hidden="true" className="size-[18px]" />
            {copy.retryImage}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={status !== "ready" || pendingAction !== null}
            onClick={onSave}
            className="border-ink/10 text-ink focus-visible:outline-olive-dark disabled:text-ink-disabled flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
          >
            {pendingAction === "saveImage" ? (
              <>
                <Loader2
                  aria-hidden="true"
                  className="size-[18px] animate-spin"
                />
                {copy.saving}
              </>
            ) : (
              <>
                <Download aria-hidden="true" className="size-[18px]" />
                {status === "ready" ? copy.save : copy.preparing}
              </>
            )}
          </button>
          <button
            type="button"
            disabled={status !== "ready" || pendingAction !== null}
            onClick={onShare}
            className="bg-olive-light focus-visible:outline-olive-dark flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-45"
          >
            {pendingAction === "shareImage" ? (
              <>
                <Loader2
                  aria-hidden="true"
                  className="size-[18px] animate-spin"
                />
                {copy.sharing}
              </>
            ) : (
              <>
                <Share2 aria-hidden="true" className="size-[18px]" />
                {status === "ready" ? copy.share : copy.preparing}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  </div>
);
