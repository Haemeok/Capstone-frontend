"use client";

import { MODELS } from "../lib/models";
import type { ResultsMap } from "../lib/useImageTest";
import { ResultCard } from "./ResultCard";

type Props = {
  enabledIds: string[];
  results: ResultsMap;
  onRetry: (modelId: string) => void;
  originalImageUrl?: string;
  originalLabel?: string;
};

export const ComparisonGrid = ({
  enabledIds,
  results,
  onRetry,
  originalImageUrl,
  originalLabel,
}: Props) => {
  const cards = MODELS.filter((m) => enabledIds.includes(m.id));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {originalImageUrl && (
        <div className="overflow-hidden rounded-2xl border-2 border-olive-light bg-white shadow-sm">
          <div className="aspect-square w-full bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalImageUrl}
              alt={originalLabel ?? "원본"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-bold text-olive-light">원본 레시피 이미지</p>
            <p className="truncate text-xs text-gray-500">
              {originalLabel ?? "Original"}
            </p>
          </div>
        </div>
      )}
      {cards.map((m) => (
        <ResultCard
          key={m.id}
          model={m}
          result={results[m.id] ?? { status: "idle" }}
          onRetry={() => onRetry(m.id)}
        />
      ))}
    </div>
  );
};
