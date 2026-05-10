// src/app/admin/video-studio/lib/types.ts

export type SeedanceModelId =
  | "dreamina-seedance-2-0-260128"
  | "dreamina-seedance-2-0-fast-260128";

export type SeedanceResolution = "480p" | "720p" | "1080p";
export type SeedanceRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";

export type SeedanceSubmitInput = {
  model: SeedanceModelId;
  prompt: string;
  imageDataUrlOrUrl?: string; // base64 data URL or public https URL; omit for text-to-video
  resolution: SeedanceResolution;
  ratio: SeedanceRatio;
  durationSec: number; // 4..15
  generateAudio: boolean;
};

export type SeedanceTaskStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "expired"
  | "cancelled";

export type SeedanceTaskState = {
  taskId: string;
  status: SeedanceTaskStatus;
  videoUrl?: string;
  errorMessage?: string;
};
