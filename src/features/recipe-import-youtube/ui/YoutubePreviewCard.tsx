import { Image } from "@/shared/ui/image/Image";
import { YoutubeMeta } from "../model/types";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrls,
} from "@/shared/lib/youtube/getYouTubeThumbnail";

type YoutubePreviewCardProps = {
  meta: YoutubeMeta;
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const YoutubePreviewCard = ({
  meta,
  onConfirm,
  isLoading = false,
  disabled = false,
}: YoutubePreviewCardProps) => {
  const videoId = extractYouTubeVideoId(meta.url);
  const thumbnailUrl = videoId
    ? getYouTubeThumbnailUrls(videoId)[0] ?? meta.thumbnailUrl
    : meta.thumbnailUrl;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm duration-300">
      <div className="mb-4 flex gap-4">
        <Image
          src={thumbnailUrl}
          alt={meta.title}
          fit="cover"
          width={160}
          height={90}
          aspectRatio="16 / 9"
          wrapperClassName="rounded-lg"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-dark mb-1 line-clamp-2 text-lg font-semibold">
            {meta.title}
          </h3>
          <p className="text-gray-600">{meta.channelName}</p>
        </div>
      </div>
      <button
        onClick={onConfirm}
        disabled={isLoading || disabled}
        className="border-olive-light hover:bg-olive-light/10 w-full rounded-lg border-1 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="text-olive-light flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            처리 중...
          </span>
        ) : (
          <p className="text-olive-light">이 영상으로 레시피 가져오기</p>
        )}
      </button>
    </div>
  );
};
