"use client";

import type { CostHistory } from "../lib/costStorage";

type Props = {
  history: CostHistory;
  onReset: () => void;
};

const fmt = (n: number) => `$${n.toFixed(3)}`;

export const CostSummary = ({ history, onReset }: Props) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">누적 비용 (추정치)</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-red-500 underline"
        >
          리셋
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-beige-light/40 rounded-lg p-2">
          <div className="text-xs text-gray-500">이미지</div>
          <div className="font-medium text-gray-900">
            {history.image.count}건 · {fmt(history.image.totalCost)}
          </div>
        </div>
        <div className="bg-beige-light/40 rounded-lg p-2">
          <div className="text-xs text-gray-500">영상</div>
          <div className="font-medium text-gray-900">
            {history.video.count}건 · {fmt(history.video.totalCost)}
          </div>
        </div>
        <div className="bg-olive-light/15 rounded-lg p-2">
          <div className="text-xs text-gray-500">총합</div>
          <div className="font-bold text-gray-900">
            {fmt(history.totalCost)}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-gray-400">
        실제 청구액과 ±20% 정도 오차 가능. 정확한 금액은 OpenAI / BytePlus 콘솔
        확인.
      </div>
    </div>
  );
};
