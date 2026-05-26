"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { BlogTone } from "../lib/toneInserts";

export const TONE_OPTIONS: Array<{ tone: BlogTone; label: string }> = [
  { tone: "epigung", label: "에궁이궁" },
  { tone: "ellymom", label: "엘리맘" },
  { tone: "elarpi", label: "elarpi" },
  { tone: "minnie46", label: "여니쿡" },
  { tone: "haetsal", label: "햇살" },
];

export const TONE_LABEL: Record<BlogTone, string> = TONE_OPTIONS.reduce(
  (acc, { tone, label }) => {
    acc[tone] = label;
    return acc;
  },
  {} as Record<BlogTone, string>,
);

type Props = {
  value: BlogTone;
  onChange: (next: BlogTone) => void;
  disabled?: boolean;
};

export const BatchToneSelector = ({ value, onChange, disabled }: Props) => {
  const handleClick = (next: BlogTone) => {
    triggerHaptic("Light");
    onChange(next);
  };
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4">
      <span className="text-xs font-semibold text-gray-700">블로거 톤</span>
      {TONE_OPTIONS.map((opt) => {
        const active = opt.tone === value;
        return (
          <button
            key={opt.tone}
            type="button"
            onClick={() => handleClick(opt.tone)}
            disabled={disabled}
            aria-pressed={active}
            className={`h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition disabled:cursor-not-allowed ${
              active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
