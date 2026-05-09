"use client";

import type { VideoGenState } from "../lib/useVideoGeneration";

type Props = { state: VideoGenState };

export const VideoResultCard = ({ state }: Props) => {
  if (state.status === "idle") return null;

  if (state.status === "submitting" || state.status === "polling") {
    const label =
      state.status === "submitting"
        ? "submitting…"
        : `task: ${state.taskId} · ${state.lastStatus}`;
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
        영상 생성 중 — {label}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        실패: {state.message}
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="text-xs text-gray-500">완료 (task {state.taskId})</div>
      <video src={state.videoUrl} controls className="w-full rounded-xl" />
      <a
        href={state.videoUrl}
        download
        className="text-xs text-olive-dark underline"
      >
        다운로드
      </a>
    </div>
  );
};
