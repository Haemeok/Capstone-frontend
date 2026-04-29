"use client";

import type { QuotaMode } from "../lib/types";

type Props = {
  value: QuotaMode;
  onChange: (mode: QuotaMode) => void;
};

const OPTIONS: ReadonlyArray<{
  value: QuotaMode;
  label: string;
  hint: string;
}> = [
  { value: "single", label: "한장씩", hint: "재료/양념 모두 단독 컷" },
  { value: "combined", label: "합치기", hint: "마이너 양념은 한 트레이로" },
];

export const QuotaModeToggle = ({ value, onChange }: Props) => {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-xl border-2 p-3 text-left transition ${
              selected
                ? "border-olive-light bg-olive-light/5"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
            <p className="text-xs text-gray-500">{opt.hint}</p>
          </button>
        );
      })}
    </div>
  );
};
