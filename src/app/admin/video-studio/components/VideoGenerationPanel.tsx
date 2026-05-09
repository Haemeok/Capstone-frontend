"use client";

import type {
  SeedanceModelId,
  SeedanceRatio,
  SeedanceResolution,
} from "../lib/types";

type Props = {
  selectedImageUrl: string | null;
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
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-bold text-gray-900">2단계 · 영상 생성</h2>

      {selectedImageUrl ? (
        <div className="flex items-center gap-3">
          <img
            src={selectedImageUrl}
            alt="selected"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <span className="text-xs text-gray-500">
            이미지 선택됨 (위 그리드에서 변경 가능)
          </span>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          위 1단계에서 이미지를 먼저 생성·선택해 주세요
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
            <option value="dreamina-seedance-2-0-fast-260128">
              2.0 Fast (저렴/빠름)
            </option>
            <option value="dreamina-seedance-2-0-260128">
              2.0 Standard (고품질)
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
          disabled={running || !selectedImageUrl || !prompt.trim()}
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
