"use client";

import { LoaderCircle } from "lucide-react";

import type { ManualCookingRecordCopy } from "./manualCookingRecord.types";

type ManualCookingRecordSubmitFooterProps = {
  formId: string;
  copy: ManualCookingRecordCopy;
  isPending: boolean;
  isImageProcessing: boolean;
};

export const ManualCookingRecordSubmitFooter = ({
  formId,
  copy,
  isPending,
  isImageProcessing,
}: ManualCookingRecordSubmitFooterProps) => (
  <div className="shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
    {isImageProcessing ? (
      <div
        role="status"
        aria-live="polite"
        className="mb-3 flex items-center gap-3"
      >
        <LoaderCircle
          aria-hidden="true"
          className="text-olive-light size-5 shrink-0 animate-spin"
        />
        <div className="min-w-0">
          <p className="text-ink text-sm font-semibold">
            {copy.processingTitle}
          </p>
          <p className="text-ink-muted mt-0.5 text-xs">
            {copy.processingDescription}
          </p>
        </div>
      </div>
    ) : null}
    <button
      type="submit"
      form={formId}
      disabled={isPending}
      className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark disabled:text-ink-disabled h-12 w-full cursor-pointer rounded-xl text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
    >
      {isImageProcessing
        ? copy.processing
        : isPending
          ? copy.submitting
          : copy.submit}
    </button>
  </div>
);
