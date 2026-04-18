"use client";

import { Download, RotateCw } from "lucide-react";

import type { ModelConfig } from "../lib/models";
import type { ModelResult } from "../lib/useImageTest";

type Props = {
  model: ModelConfig;
  result: ModelResult;
  onRetry: () => void;
};

const downloadImage = async (url: string, filename: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
};

export const ResultCard = ({ model, result, onRetry }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-square w-full bg-gray-50">
        {result.status === "success" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={result.imageUrl} alt={model.label} className="h-full w-full object-cover" />
        )}
        {result.status === "pending" && (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-olive-light" />
          </div>
        )}
        {result.status === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="line-clamp-4 text-xs text-red-500">{result.message}</p>
            <button
              onClick={onRetry}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
            >
              <RotateCw className="h-3 w-3" /> 재시도
            </button>
          </div>
        )}
        {result.status === "idle" && <div className="h-full" />}
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{model.label}</p>
          <p className="text-xs text-gray-500">
            {model.vendor} · ${model.pricePerImage.toFixed(3)}
            {result.status === "success" && ` · ${(result.latencyMs / 1000).toFixed(1)}s`}
            {result.status === "error" && ` · ${(result.latencyMs / 1000).toFixed(1)}s`}
          </p>
        </div>
        {result.status === "success" && (
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => downloadImage(result.imageUrl, `${model.id}.png`)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              title="다운로드"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onRetry}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              title="다시 생성"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
