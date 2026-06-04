"use client";

import type { CostHistory } from "@/app/admin/image-quality-test/lib/costStorage";
import { getModelById } from "@/app/admin/image-quality-test/lib/models";

import {
  type ImageEditQuality,
  QUALITY_TO_MODEL_ID,
} from "../lib/useImageEdit";

const QUALITY_ORDER: ReadonlyArray<ImageEditQuality> = [
  "low",
  "medium",
  "high",
];

type Props = {
  history: CostHistory;
  onReset: () => void;
};

export const CostPanel = ({ history, onReset }: Props) => {
  const rows = QUALITY_ORDER.map((q) => {
    const id = QUALITY_TO_MODEL_ID[q];
    const entry = history.byModel[id];
    return {
      quality: q,
      label: getModelById(id)?.label ?? id,
      count: entry?.count ?? 0,
      cost: entry?.totalCost ?? 0,
    };
  });

  const subtotal = rows.reduce((sum, r) => sum + r.cost, 0);
  const subCount = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-gray-900">누적 비용</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          초기화
        </button>
      </div>

      <div className="bg-olive-light/5 mb-3 rounded-xl p-3">
        <p className="text-xs text-gray-500">GPT Image 2 합계</p>
        <p className="text-xl font-bold text-gray-900">
          ${subtotal.toFixed(3)}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({subCount}회)
          </span>
        </p>
      </div>

      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.quality} className="flex justify-between text-xs">
            <span className="truncate text-gray-600 capitalize">
              {row.quality}
            </span>
            <span className="shrink-0 text-gray-500">
              {row.count}회 · ${row.cost.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-gray-400">
        image-quality-test와 같은 ledger를 공유해요.
      </p>
    </div>
  );
};
