export type YoutubeMeta = {
  url: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoId: string;
};

export type YoutubeImportResponse =
  | { recipeId: string }
  | { code: number; message: string };

export type ExtractionStatus = {
  status: "pending" | "success" | "failed";
  recipeId?: string;
  error?: {
    code: number;
    message: string;
  };
};

export type YoutubeDuplicateCheckResponse = {
  recipeId?: string;
};

// ========== Job Polling Types (V2 API) ==========

export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type JobCreationResponse = {
  jobId: string;
};

export type JobStatusResponse = {
  jobId: string;
  status: JobStatus;
  progress?: number;
  resultRecipeId?: string;
  code?: string;
  message?: string;
  retryAfter?: number;
};

export type PersistedJob = {
  idempotencyKey: string;
  url: string;
  meta: YoutubeMeta;
  jobId: string | null;
  startTime: number;
  lastPollTime: number;
  retryCount: number;
};

export type JobState = "creating" | "polling" | "completed" | "failed";

export type ActiveJob = PersistedJob & {
  state: JobState;
  progress: number;
  resultRecipeId?: string;
  code?: string;
  message?: string;
  retryAfter?: number;
};
