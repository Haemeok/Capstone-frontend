"use client";

import React from "react";
import { Image } from "@/shared/ui/image/Image";
import { YoutubeMeta } from "../model/types";
import { useYoutubeImportStore } from "../model/store";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrls,
} from "@/shared/lib/youtube/getYouTubeThumbnail";

type PendingRecipeCardProps = {
  url: string;
};

export const PendingRecipeCard = ({ url }: PendingRecipeCardProps) => {
  const importItem = useYoutubeImportStore((state) => state.imports[url]);
  const removeImport = useYoutubeImportStore((state) => state.removeImport);

  if (!importItem) return null;

  const { meta, status, error } = importItem;

  const videoId = extractYouTubeVideoId(meta.url);
  const thumbnailUrls = videoId
    ? [meta.thumbnailUrl, ...getYouTubeThumbnailUrls(videoId)]
    : [meta.thumbnailUrl];

  return (
    <div className="group relative block h-full overflow-hidden rounded-2xl bg-gray-100">
      <div className="relative aspect-square">
        <Image
          src={thumbnailUrls}
          alt={meta.title}
          aspectRatio="1 / 1"
          imgClassName={`transition-opacity w-full h-full ${
            status === "pending" ? "opacity-50" : "opacity-70"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="space-y-3 px-4 text-center">
            {status === "pending" && (
              <>
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-white" />
                <p className="text-sm font-semibold text-white">분석 중...</p>
              </>
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
                  {error || "실패"}
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
