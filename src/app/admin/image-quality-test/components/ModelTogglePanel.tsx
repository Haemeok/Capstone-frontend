"use client";

import { useEffect, useRef, useState } from "react";

import { MODELS } from "../lib/models";
import { loadEnabledModels, saveEnabledModels } from "../lib/toggleStorage";

type Props = { onChange: (enabledIds: string[]) => void };

export const ModelTogglePanel = ({ onChange }: Props) => {
  const [enabled, setEnabled] = useState<string[]>(() => loadEnabledModels());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current(enabled);
    // Intentionally fires once on mount to notify parent of the localStorage-loaded initial set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    const next = enabled.includes(id) ? enabled.filter((x) => x !== id) : [...enabled, id];
    setEnabled(next);
    saveEnabledModels(next);
    onChange(next);
  };

  const totalCost = MODELS.filter((m) => enabled.includes(m.id)).reduce(
    (sum, m) => sum + m.pricePerImage,
    0
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-gray-900">
          모델 선택 ({enabled.length}/{MODELS.length})
        </h3>
        <span className="text-xs text-gray-500">1회당 예상 ${totalCost.toFixed(3)}</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {MODELS.map((m) => {
          const isOn = enabled.includes(m.id);
          return (
            <button
              type="button"
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 text-left text-sm transition-colors ${
                isOn
                  ? "border-olive-light bg-olive-light/5 text-gray-900"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              <span className="truncate">
                <span className="font-medium">{m.label}</span>
                <span className="ml-2 text-xs text-gray-400">{m.vendor}</span>
              </span>
              <span className="shrink-0 text-xs text-gray-500">${m.pricePerImage.toFixed(3)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
