"use client";

import { useState, useEffect } from "react";
import { Image } from "@/shared/ui/image/Image";
import { useYoutubeImportStore } from "../model/store";
import { XCircle, CheckCircle } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrls,
} from "@/shared/lib/youtube/getYouTubeThumbnail";
import { CircularProgress } from "./CircularProgress";
import { calculateFakeProgress } from "../lib/progress";

type ImportStatus = "pending" | "success" | "error";

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
          imgClassName={`transition-opacity w-full h-full ${status === "pending" ? "opacity-50" : "opacity-70"
            }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="space-y-3 px-4 text-center">
            {status === "pending" && (
              <div className="relative mx-auto h-20 w-20">
                <CircularProgress value={progress} size={80} strokeWidth={6} />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {progress}%
                </span>
              </div>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
                <p className="text-sm font-semibold text-white">완료!</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="mx-auto h-10 w-10 text-red-400" />
                <p className="text-xs font-semibold break-keep text-white">
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
      <p className="absolute right-4 bottom-2.5 left-4 line-clamp-2 text-[17px] font-bold text-white">
        {meta.title}
      </p>
    </div>
  );
};
