"use client";

import { useRef } from "react";

import type {
  SeedanceModelId,
  SeedanceRatio,
  SeedanceResolution,
} from "../lib/types";

type Props = {
  selectedImageUrl: string | null;
  onImageUpload: (dataUrl: string | null) => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  model: SeedanceModelId;
  onModelChange: (v: SeedanceModelId) => void;
  resolution: SeedanceResolution;
  onResolutionChange: (v: SeedanceResolution) => void;
  ratio: SeedanceRatio;
  onRatioChange: (v: SeedanceRatio) => void;
  durationSec: number;
  onDurationChange: (v: number) => void;
  generateAudio: boolean;
  onGenerateAudioChange: (v: boolean) => void;
  running: boolean;
  pollLabel?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

export const VideoGenerationPanel = ({
  selectedImageUrl,
  onImageUpload,
  prompt,
  onPromptChange,
  model,
  onModelChange,
  resolution,
  onResolutionChange,
  ratio,
  onRatioChange,
  durationSec,
  onDurationChange,
  generateAudio,
  onGenerateAudioChange,
  running,
  pollLabel,
  onSubmit,
  onCancel,
}: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      onImageUpload(typeof r === "string" ? r : null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-gray-900">2단계 · 영상 생성</h2>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {selectedImageUrl ? (
        <div className="flex items-center gap-3">
          <img
            src={selectedImageUrl}
            alt="selected"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span>이미지 선택됨</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="text-olive-dark underline"
              >
                변경
              </button>
              <button
                type="button"
                onClick={() => onImageUpload(null)}
                className="text-red-500 underline"
              >
                제거
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          <div>1단계에서 선택하거나 직접 업로드하세요</div>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700"
          >
            파일 선택
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2 text-xs text-gray-600">
          모델
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value as SeedanceModelId)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
          >
            <option value="dreamina-seedance-2-0-260128">
              2.0 Standard (고품질)
            </option>
            <option value="dreamina-seedance-2-0-fast-260128">
              2.0 Fast (저렴/빠름)
            </option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-600">
          해상도
          <select
            value={resolution}
            onChange={(e) =>
              onResolutionChange(e.target.value as SeedanceResolution)
            }
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
          >
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-600">
          비율
          <select
            value={ratio}
            onChange={(e) => onRatioChange(e.target.value as SeedanceRatio)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
            <option value="3:4">3:4</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-600">
          길이(초)
          <input
            type="number"
            min={4}
            max={15}
            value={durationSec}
            onChange={(e) =>
              onDurationChange(
                Math.max(4, Math.min(15, Number(e.target.value) || 5))
              )
            }
            className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm"
          />
        </label>

        <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={generateAudio}
            onChange={(e) => onGenerateAudioChange(e.target.checked)}
          />
          오디오 생성
        </label>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={5}
        placeholder="영상 프롬프트"
        className="w-full rounded-lg border border-gray-200 p-2 text-sm"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onSubmit}
          disabled={running || !prompt.trim()}
          className="h-10 rounded-xl bg-olive-light px-4 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          {running ? `진행 중 (${pollLabel ?? "..."})` : "영상 생성"}
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
