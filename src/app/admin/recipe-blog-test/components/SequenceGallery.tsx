"use client";

import {
  type SequenceCategory,
  type SequenceImage,
  type SequenceModelId,
} from "../lib/types";
import type { SequenceResults } from "../lib/useSequenceGenerate";
import { SequenceCard } from "./SequenceCard";

type Props = {
  sequence: SequenceImage[];
  results: SequenceResults;
  onRetry: (image: SequenceImage, modelId: SequenceModelId) => void;
};

const SECTIONS: ReadonlyArray<{ key: SequenceCategory; title: string }> = [
  { key: "step", title: "조리 과정 (Steps)" },
  { key: "final", title: "완성 (Final)" },
];

export const SequenceGallery = ({ sequence, results, onRetry }: Props) => {
  return (
    <div className="space-y-6">
      {SECTIONS.map(({ key, title }) => {
        const items = sequence.filter((s) => s.category === key);
        if (items.length === 0) return null;
        return (
          <section key={key}>
            <h2 className="mb-2 text-sm font-bold text-gray-700">{title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((image) => (
                <SequenceCard
                  key={image.id}
                  image={image}
                  results={results}
                  onRetry={onRetry}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
