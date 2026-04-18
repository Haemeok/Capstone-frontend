"use client";

import { MODELS } from "../lib/models";
import type { ResultsMap } from "../lib/useImageTest";

import { ResultCard } from "./ResultCard";

type Props = {
  enabledIds: string[];
  results: ResultsMap;
  onRetry: (modelId: string) => void;
};

export const ComparisonGrid = ({ enabledIds, results, onRetry }: Props) => {
  const cards = MODELS.filter((m) => enabledIds.includes(m.id));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
