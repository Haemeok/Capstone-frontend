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

const MAX_REFERENCES = 16;

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  modelId: ImageModelId;
  onModelChange: (v: ImageModelId) => void;
  count: number;
  onCountChange: (v: number) => void;
  referenceImageUrls: readonly string[];
  onReferenceImagesChange: (next: string[]) => void;
  running: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") resolve(r);
      else reject(new Error("FileReader returned non-string"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
    reader.readAsDataURL(file);
  });

export const ImageGenerationPanel = ({
  prompt,
  onPromptChange,
  modelId,
  onModelChange,
  count,
  onCountChange,
  referenceImageUrls,
  onReferenceImagesChange,
  running,
  onSubmit,
  onCancel,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    try {
      const dataUrls = await Promise.all(images.map(readFileAsDataUrl));
      const next = [...referenceImageUrls, ...dataUrls].slice(0, MAX_REFERENCES);
      onReferenceImagesChange(next);
    } catch (err) {
      console.error("이미지 읽기 실패", err);
    }
  };

  const handleRemove = (idx: number) => {
    onReferenceImagesChange(referenceImageUrls.filter((_, i) => i !== idx));
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
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs text-gray-600">
            레퍼런스 이미지 (선택, {referenceImageUrls.length}/{MAX_REFERENCES})
          </label>
          {referenceImageUrls.length > 0 && (
            <button
              type="button"
              onClick={() => onReferenceImagesChange([])}
              className="text-[10px] text-gray-500 underline"
            >
              전체 제거
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {referenceImageUrls.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {referenceImageUrls.map((url, idx) => (
              <div key={`${idx}-${url.slice(0, 32)}`} className="relative">
                <img
                  src={url}
                  alt={`reference ${idx + 1}`}
                  className="h-16 w-16 rounded-card object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute -right-1 -top-1 rounded-full bg-white text-[10px] text-gray-600 shadow"
                  aria-label={`${idx + 1}번 제거`}
                >
                  <span className="block h-4 w-4 leading-4">×</span>
                </button>
              </div>
            ))}
            {referenceImageUrls.length < MAX_REFERENCES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 hover:bg-gray-100"
              >
                + 추가
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            파일 선택 (여러 장)
          </button>
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
