"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { ImageEditQuality, RunCell } from "../lib/useImageEdit";

type Props = {
  quality: ImageEditQuality;
  cell: RunCell;
  included: boolean;
};

export const ResultCard = ({ quality, cell, included }: Props) => {
  return (
    <div
      className={`rounded-2xl border bg-white p-3 transition ${
        included ? "border-gray-100" : "border-gray-100 opacity-50"
      }`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs font-bold text-gray-900 capitalize">{quality}</p>
        {cell.status === "success" && (
          <p className="text-[10px] text-gray-500">
            ${cell.cost.toFixed(3)} · {(cell.latencyMs / 1000).toFixed(1)}초
          </p>
        )}
      </div>

      <div className="rounded-card aspect-square w-full overflow-hidden bg-gray-50">
        {cell.status === "idle" && (
          <div className="flex h-full items-center justify-center text-[11px] text-gray-400">
            {included ? "대기" : "선택 안 됨"}
          </div>
        )}
        {cell.status === "running" && (
          <div className="flex h-full items-center justify-center text-[11px] text-gray-500">
            생성 중…
          </div>
        )}
        {cell.status === "error" && (
          <div className="flex h-full items-center justify-center p-3 text-center text-[11px] text-red-600">
            실패: {cell.message}
          </div>
        )}
        {cell.status === "success" && (
          <img
            src={cell.imageUrl}
            alt={`결과 (${quality})`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {cell.status === "success" && (
        <a
          href={cell.imageUrl}
          download={`image-edit-${quality}-${cell.completedAt}.png`}
          onClick={() => triggerHaptic("Success")}
          className="mt-2 block rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          저장
        </a>
      )}
    </div>
  );
};
