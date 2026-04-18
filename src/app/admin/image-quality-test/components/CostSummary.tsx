"use client";

import type { CostHistory } from "../lib/costStorage";
import { MODELS } from "../lib/models";

type Props = {
  history: CostHistory;
  onReset: () => void;
};

export const CostSummary = ({ history, onReset }: Props) => {
  const handleReset = () => {
    if (!confirm("누적 비용 기록을 초기화하시겠어요?")) return;
    onReset();
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-gray-900">누적 비용</h3>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          초기화
        </button>
      </div>

      <div className="mb-3 rounded-xl bg-olive-light/5 p-3">
        <p className="text-xs text-gray-500">합계</p>
        <p className="text-xl font-bold text-gray-900">
          ${history.totalCost.toFixed(3)}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({history.totalCount}회)
          </span>
        </p>
      </div>

      <div className="space-y-1">
        {MODELS.map((m) => {
          const entry = history.byModel[m.id];
          const count = entry?.count ?? 0;
          const cost = entry?.totalCost ?? 0;
          return (
            <div key={m.id} className="flex justify-between text-xs">
              <span className="truncate text-gray-600">{m.label}</span>
              <span className="shrink-0 text-gray-500">
                {count}회 · ${cost.toFixed(3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
