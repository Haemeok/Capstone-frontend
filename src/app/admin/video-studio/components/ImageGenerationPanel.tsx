"use client";

import { useRef } from "react";

export type ImageModelId =
  | "gpt-image-2-low"
  | "gpt-image-2-medium"
  | "gpt-image-2-high";

const MODEL_LABELS: Record<ImageModelId, string> = {
  "gpt-image-2-low": "GPT Image 2 (Low)",
  "gpt-image-2-medium": "GPT Image 2 (Medium)",
  "gpt-image-2-high": "GPT Image 2 (High)",
};

const MODEL_OPTIONS: ImageModelId[] = [
  "gpt-image-2-low",
  "gpt-image-2-medium",
  "gpt-image-2-high",
];

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  modelId: ImageModelId;
  onModelChange: (v: ImageModelId) => void;
  count: number;
  onCountChange: (v: number) => void;
  referenceImageUrl: string | null;
  onReferenceImageChange: (dataUrl: string | null) => void;
  running: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export const ImageGenerationPanel = ({
  prompt,
  onPromptChange,
  modelId,
  onModelChange,
  count,
  onCountChange,
  referenceImageUrl,
  onReferenceImageChange,
  running,
  onSubmit,
  onCancel,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      onReferenceImageChange(typeof r === "string" ? r : null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-gray-900">1단계 · 이미지 생성</h2>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600">
          모델
          <select
            value={modelId}
            onChange={(e) => onModelChange(e.target.value as ImageModelId)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
          >
            {MODEL_OPTIONS.map((id) => (
              <option key={id} value={id}>
                {MODEL_LABELS[id]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-600">
          장수 (1~4)
          <input
            type="number"
            min={1}
            max={4}
            value={count}
            onChange={(e) =>
              onCountChange(Math.max(1, Math.min(4, Number(e.target.value) || 1)))
            }
            className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm"
          />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-600">
          레퍼런스 이미지 (선택)
        </label>
        {referenceImageUrl ? (
          <div className="flex items-center gap-2">
            <img
              src={referenceImageUrl}
              alt="reference"
              className="h-16 w-16 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => onReferenceImageChange(null)}
              className="text-xs text-gray-500 underline"
            >
              제거
            </button>
          </div>
        ) : (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="text-sm"
          />
        )}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={6}
        placeholder="프롬프트를 입력하세요 (레시피 선택 시 자동으로 채워집니다)"
        className="w-full rounded-lg border border-gray-200 p-2 text-sm"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onSubmit}
          disabled={running || !prompt.trim()}
          className="h-10 rounded-xl bg-olive-light px-4 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          {running ? "생성 중…" : `이미지 ${count}장 생성`}
        </button>
        {running && (
          <button onClick={onCancel} className="text-xs text-red-500 underline">
            취소
          </button>
        )}
      </div>
    </div>
  );
};
