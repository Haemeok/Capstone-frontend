"use client";

import { useState } from "react";

import { RotateCcw } from "lucide-react";

import {
  SEQUENCE_MODEL_IDS,
  type SequenceImage,
  type SequenceModelId,
} from "../lib/types";
import type { SequenceResults } from "../lib/useSequenceGenerate";

type Props = {
  image: SequenceImage;
  results: SequenceResults;
  onRetry: (image: SequenceImage, modelId: SequenceModelId) => void;
};

const MODEL_LABEL: Record<SequenceModelId, string> = {
  "gpt-image-2-low": "Low",
  "gpt-image-2-medium": "Medium",
};

export const SequenceCard = ({ image, results, onRetry }: Props) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const cells = results[image.id];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-gray-900">{image.label}</p>
        <button
          type="button"
          onClick={() => setShowPrompt((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {showPrompt ? "프롬프트 닫기" : "프롬프트 보기"}
        </button>
      </div>

      {showPrompt && (
        <pre className="mb-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
          {image.prompt}
        </pre>
      )}

      <div className="grid grid-cols-2 gap-2">
        {SEQUENCE_MODEL_IDS.map((modelId) => {
          const cell = cells?.[modelId] ?? { status: "idle" as const };
          return (
            <div
              key={modelId}
              className="overflow-hidden rounded-xl border border-gray-100"
            >
              <div className="flex items-center justify-between bg-gray-50 px-2 py-1 text-xs">
                <span className="font-medium text-gray-700">
                  {MODEL_LABEL[modelId]}
                </span>
                {(cell.status === "success" || cell.status === "error") && (
                  <button
                    type="button"
                    onClick={() => onRetry(image, modelId)}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-800"
                  >
                    <RotateCcw className="h-3 w-3" /> 재생성
                  </button>
                )}
              </div>

              <div className="flex aspect-square w-full items-center justify-center bg-gray-100">
                {cell.status === "pending" && (
                  <p className="text-xs text-gray-400">생성 중…</p>
                )}
                {cell.status === "idle" && (
                  <p className="text-xs text-gray-400">대기</p>
                )}
                {cell.status === "error" && (
                  <p className="px-2 text-center text-xs text-red-500">
                    {cell.message}
                  </p>
                )}
                {cell.status === "success" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cell.imageUrl}
                    alt={image.label}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {cell.status === "success" && (
                <div className="px-2 py-1 text-[10px] text-gray-500">
                  ${cell.cost.toFixed(3)} · {cell.latencyMs}ms
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
