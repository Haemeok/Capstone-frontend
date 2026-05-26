"use client";

import { useState } from "react";

import type { BatchItem } from "../lib/useBatchRewrite";
import { CurationBlogPreview } from "./CurationBlogPreview";
import { TONE_LABEL } from "./BatchToneSelector";

const PHASE_LABEL: Record<BatchItem["phase"], string> = {
  queued: "대기",
  fetching: "데이터 조회 중…",
  generating: "리라이트 중…",
  ready: "리라이트 완료",
  enqueueing: "큐로 보내는 중…",
  enqueued: "큐에 담김 ✓",
  failed: "실패",
  "enqueue-failed": "큐 실패",
};

const PHASE_BADGE_CLASS: Record<BatchItem["phase"], string> = {
  queued: "bg-gray-100 text-gray-600",
  fetching: "bg-blue-50 text-blue-700",
  generating: "bg-blue-50 text-blue-700",
  ready: "bg-emerald-50 text-emerald-700",
  enqueueing: "bg-amber-50 text-amber-700",
  enqueued: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-50 text-red-700",
  "enqueue-failed": "bg-red-50 text-red-700",
};

type Props = {
  item: BatchItem;
};

export const BatchItemCard = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const canPreview = item.phase === "ready" || item.phase === "enqueueing" || item.phase === "enqueued" || item.phase === "enqueue-failed";
  return (
    <article className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
      <header className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${PHASE_BADGE_CLASS[item.phase]}`}>
              {PHASE_LABEL[item.phase]}
            </span>
            {item.tone && (
              <span className="rounded bg-gray-900 px-2 py-0.5 text-[11px] text-white">
                {TONE_LABEL[item.tone]}
              </span>
            )}
          </p>
        </div>
        {canPreview && item.ready && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50"
          >
            {open ? "미리보기 접기" : "미리보기 펼치기"}
          </button>
        )}
      </header>

      {item.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{item.error}</p>
      )}

      {item.enqueued && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {item.enqueued.packagePath}
          {item.enqueued.skippedSlots.length > 0 && (
            <span className="ml-2 text-amber-700">
              (이미지 {item.enqueued.skippedSlots.length}장 누락)
            </span>
          )}
        </p>
      )}

      {open && item.ready && (
        <div className="border-t border-gray-100 pt-3">
          <CurationBlogPreview
            post={item.ready.post}
            imageUrlsBySlot={item.ready.imageUrlsBySlot}
            recipes={item.ready.recipes}
          />
        </div>
      )}
    </article>
  );
};
