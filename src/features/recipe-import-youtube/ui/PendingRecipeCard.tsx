"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrls,
} from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image/Image";

import {
  SmoothProgressStatus,
  useSmoothProgress,
} from "../lib/useSmoothProgress";
import { useYoutubeImportStoreV2 } from "../model/store";
import { JobState } from "../model/types";

const jobStateToImportStatus = (state: JobState): SmoothProgressStatus => {
  switch (state) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    default:
      return "pending";
  }
};

const YoutubeGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="h-3.5 w-3.5 shrink-0 fill-red-500"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    <path d="M9.545 8.432v7.136L15.818 12z" fill="white" />
  </svg>
);

type PendingRecipeCardProps = {
  idempotencyKey: string;
};

export const PendingRecipeCard = ({
  idempotencyKey,
}: PendingRecipeCardProps) => {
  const job = useYoutubeImportStoreV2((state) => state.jobs[idempotencyKey]);
  const removeJob = useYoutubeImportStoreV2((state) => state.removeJob);

  const status: SmoothProgressStatus = job
    ? jobStateToImportStatus(job.state)
    : "pending";
  const realProgress = !job
    ? 0
    : job.state === "completed"
      ? 100
      : job.state === "failed"
        ? 0
        : job.progress;
  const progress = useSmoothProgress(
    realProgress,
    status,
    job?.startTime ?? Date.now()
  );

  if (!job) return null;

  const { meta } = job;
  const errorMessage = job.state === "failed" ? job.message : undefined;

  const videoId = extractYouTubeVideoId(meta.url);
  const thumbnailUrl = videoId
    ? (getYouTubeThumbnailUrls(videoId)[0] ?? meta.thumbnailUrl)
    : meta.thumbnailUrl;

  return (
    <div className="relative flex shrink-0 flex-col">
      <div className="rounded-card relative overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={meta.title}
          aspectRatio="1 / 1"
          fit="cover"
        />

        {status === "pending" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 backdrop-blur-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              <span className="text-[12px] font-semibold text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-emerald-500/25">
            <CheckCircle2 className="h-10 w-10 text-white drop-shadow-md" />
          </div>
        )}

        {status === "error" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45">
            <XCircle className="h-10 w-10 text-red-300 drop-shadow-md" />
          </div>
        )}
      </div>

      {meta.channelName && (
        <div className="flex items-center gap-1 overflow-hidden px-0.5 pt-1.5">
          <YoutubeGlyph />
          <span className="truncate text-[13px] text-gray-500">
            {meta.channelName}
          </span>
        </div>
      )}

      <div className="flex grow flex-col gap-1 px-0.5 pt-1 pb-1">
        <p className="line-clamp-2 text-[15px] leading-snug break-keep">
          {meta.title}
        </p>

        <div className="flex items-center justify-between gap-2 text-[13px] text-gray-500">
          {status === "pending" && (
            <span className="truncate">
              레시피 추출 중 · {Math.round(progress)}%
            </span>
          )}
          {status === "success" && (
            <span className="truncate text-emerald-600">추출 완료</span>
          )}
          {status === "error" && (
            <>
              <span className="line-clamp-1 text-red-500">
                {errorMessage ?? "추출 실패"}
              </span>
              <button
                type="button"
                onClick={() => removeJob(idempotencyKey)}
                aria-label="에러 닫기"
                className="shrink-0 cursor-pointer text-[12px] text-gray-400 underline hover:text-gray-600"
              >
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
