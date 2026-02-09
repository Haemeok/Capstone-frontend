"use client";

import { useState, useEffect } from "react";

import { CheckCircle, XCircle } from "lucide-react";

import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrls,
} from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image/Image";

import { calculateFakeProgress } from "../lib/progress";
import { useYoutubeImportStore, useYoutubeImportStoreV2 } from "../model/store";
import { JobState } from "../model/types";
import { CircularProgress } from "./CircularProgress";

type ImportStatus = "pending" | "success" | "error";

const AnimatedStatusText = () => (
  <p className="text-[15px] font-semibold text-white drop-shadow-md">
    레시피 추출 중
    <span className="ml-1 inline-flex w-6">
      <span className="animate-[bounce_1s_0ms_infinite]">.</span>
      <span className="animate-[bounce_1s_150ms_infinite]">.</span>
      <span className="animate-[bounce_1s_300ms_infinite]">.</span>
    </span>
  </p>
);

const UPDATE_INTERVAL_MS = 2000;

const useFakeProgress = (startTime: number, status: ImportStatus) => {
  const [progress, setProgress] = useState(() =>
    calculateFakeProgress(startTime)
  );

  useEffect(() => {
    if (status !== "pending") return;

    const interval = setInterval(() => {
      setProgress(calculateFakeProgress(startTime));
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [startTime, status]);

  return status === "success" ? 100 : progress;
};

const jobStateToImportStatus = (state: JobState): ImportStatus => {
  switch (state) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    default:
      return "pending";
  }
};

// ========== Legacy Version (URL-based) ==========
type PendingRecipeCardProps = {
  url: string;
};

export const PendingRecipeCard = ({ url }: PendingRecipeCardProps) => {
  const importItem = useYoutubeImportStore((state) => state.imports[url]);
  const removeImport = useYoutubeImportStore((state) => state.removeImport);

  const progress = useFakeProgress(
    importItem?.startTime ?? Date.now(),
    importItem?.status ?? "pending"
  );

  if (!importItem) return null;

  const { meta, status, error } = importItem;

  const videoId = extractYouTubeVideoId(meta.url);
  const thumbnailUrl = videoId
    ? getYouTubeThumbnailUrls(videoId)[0] ?? meta.thumbnailUrl
    : meta.thumbnailUrl;

  return (
    <div className="group relative block h-full overflow-hidden rounded-2xl bg-gray-100">
            <div className="relative aspect-square">
        <Image
          src={thumbnailUrl}
          alt={meta.title}
          aspectRatio="1 / 1"
          imgClassName={`transition-opacity w-full h-full ${
            status === "pending" ? "opacity-50" : "opacity-70"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="px-4 text-center">
            {status === "pending" && (
              <>
                <AnimatedStatusText />
                <div className="relative mx-auto mt-2 h-20 w-20 overflow-visible">
                  <CircularProgress value={progress} size={80} strokeWidth={6} />
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow-md">
                    {progress}%
                  </span>
                </div>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
                <p className="mt-2 text-sm font-semibold text-white">완료!</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="mx-auto h-10 w-10 text-red-400" />
                <p className="mt-2 break-keep text-xs font-semibold text-white">
                  {error?.message || "실패"}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeImport(url);
                  }}
                  className="mt-2 text-xs text-white/80 underline hover:text-white"
                >
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent" />
      <p className="absolute right-4 bottom-2.5 left-4 line-clamp-2 text-[17px] font-bold leading-[1.15] text-white">
        {meta.title}
      </p>
    </div>
  );
};

// ========== V2 Version (idempotencyKey-based) ==========
type PendingRecipeCardV2Props = {
  idempotencyKey: string;
};

export const PendingRecipeCardV2 = ({
  idempotencyKey,
}: PendingRecipeCardV2Props) => {
  const job = useYoutubeImportStoreV2((state) => state.jobs[idempotencyKey]);
  const removeJob = useYoutubeImportStoreV2((state) => state.removeJob);

  const status = job ? jobStateToImportStatus(job.state) : "pending";

  const fakeProgress = useFakeProgress(job?.startTime ?? Date.now(), status);
  const realProgress = job?.progress ?? 0;
  const progress =
    status === "success" ? 100 : Math.max(fakeProgress, realProgress);

  if (!job) return null;

  const { meta, message } = job;

  const videoId = extractYouTubeVideoId(meta.url);
  const thumbnailUrl = videoId
    ? getYouTubeThumbnailUrls(videoId)[0] ?? meta.thumbnailUrl
    : meta.thumbnailUrl;

  return (
    <div className="group relative block h-full overflow-hidden rounded-2xl bg-gray-100">
            <div className="relative aspect-square">
        <Image
          src={thumbnailUrl}
          alt={meta.title}
          aspectRatio="1 / 1"
          imgClassName={`transition-opacity w-full h-full ${
            status === "pending" ? "opacity-50" : "opacity-70"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="px-4 text-center flex flex-col items-center justify-center -mt-4">
            {status === "pending" && (
              <>
                <AnimatedStatusText />
                <div className="relative h-20 w-20">
                  <CircularProgress
                    value={Math.round(progress)}
                    size={80}
                    strokeWidth={6}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow-md">
                    {Math.round(progress)}%
                  </span>
                </div>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
                <p className="mt-2 text-sm font-semibold text-white">완료!</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="mx-auto h-10 w-10 text-red-400" />
                <p className="mt-2 break-keep text-xs font-semibold text-white">
                  {message || "실패"}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeJob(idempotencyKey);
                  }}
                  className="mt-2 text-xs text-white/80 underline hover:text-white"
                >
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent" />
      <p className="absolute right-4 bottom-2.5 left-4 line-clamp-2 text-[17px] font-bold leading-[1.15] text-white">
        {meta.title}
      </p>
    </div>
  );
};
