"use client";

import { Download, RotateCw } from "lucide-react";

import type { PromptVariant } from "../lib/promptVariants";
import type { VariantResult } from "../lib/usePromptCompare";

type Props = {
  variant: PromptVariant;
  prompt: string;
  onPromptChange: (next: string) => void;
  result: VariantResult;
  onRetry: () => void;
  disabled: boolean;
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

export const PromptVariantCard = ({
  variant,
  prompt,
  onPromptChange,
  result,
  onRetry,
  disabled,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3">
      <div>
        <p className="truncate text-sm font-bold text-gray-900">
          {variant.label}
        </p>
        <p className="line-clamp-2 text-xs text-gray-500">{variant.description}</p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={
          variant.isPlaceholder
            ? "이 슬롯에 비교하고 싶은 프롬프트를 직접 작성하세요"
            : "레시피 선택 시 자동 생성됩니다"
        }
        className="h-40 w-full resize-none rounded-xl border border-gray-200 p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
      />
      <p className="text-right text-[10px] text-gray-400">{prompt.length} chars</p>

      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        {result.status === "success" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.imageUrl}
            alt={variant.label}
            className="h-full w-full object-cover"
          />
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
              type="button"
              onClick={onRetry}
              disabled={disabled || prompt.trim().length === 0}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              <RotateCw className="h-3 w-3" /> 재시도
            </button>
          </div>
        )}
        {result.status === "idle" && <div className="h-full" />}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {result.status === "success" &&
            `$${result.cost.toFixed(3)} · ${(result.latencyMs / 1000).toFixed(1)}s`}
          {result.status === "error" &&
            `${(result.latencyMs / 1000).toFixed(1)}s`}
          {(result.status === "idle" || result.status === "pending") && "—"}
        </span>
        {result.status === "success" && (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() =>
                downloadImage(result.imageUrl, `${variant.id}.png`)
              }
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              title="다운로드"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRetry}
              disabled={disabled || prompt.trim().length === 0}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
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
