"use client";

import { createContext, useContext, useRef, useState } from "react";

import { Pin } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";
import {
  parseTimelineToSeconds,
  YouTubeVideoPlayer,
  type YouTubeVideoPlayerRef,
} from "@/shared/ui/YouTubeVideoPlayer";

type VideoPlayerContextType = {
  seekToTimeline: (timeline: string) => void;
};

const VideoPlayerContext = createContext<VideoPlayerContextType | null>(null);

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  return context;
};

type YoutubeMetadata = {
  channelName?: string;
  videoTitle?: string;
  channelProfileUrl?: string;
  subscriberCount?: number;
  thumbnailUrl?: string;
  channelId?: string;
};

type RecipeVideoSectionProps = {
  videoUrl: string;
  youtubeMetadata?: YoutubeMetadata;
  children?: React.ReactNode;
};

export default function RecipeVideoSection({
  videoUrl,
  youtubeMetadata,
  children,
}: RecipeVideoSectionProps) {
  const playerRef = useRef<YouTubeVideoPlayerRef>(null);
  const [isSticky, setIsSticky] = useState(false);

  if (videoUrl === "") {
    return <>{children}</>;
  }

  const seekToTimeline = (timeline: string) => {
    const seconds = parseTimelineToSeconds(timeline);

    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };

  const toggleSticky = () => {
    setIsSticky(!isSticky);
  };


  const shouldShowYoutubeInfo =
    !isSticky &&
    youtubeMetadata?.channelName &&
    youtubeMetadata?.channelProfileUrl;

  const formatSubscriberCount = (count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}만명`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}천명`;
    }
    return `${count}명`;
  };

  return (
    <VideoPlayerContext.Provider value={{ seekToTimeline }}>
      <section className="relative">
        <div
          className={cn(
            "w-full transition-all",
            isSticky
              ? "my-6 flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50"
              : "hidden h-0"
          )}
        >
          {isSticky && (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Pin className="h-5 w-5" />
              <span className="text-xs">영상이 상단에 고정되었습니다</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isSticky
              ? "fixed top-20 right-0 left-0 z-50 mx-auto w-full px-4 md:max-w-3xl"
              : "relative z-0 my-6 w-full"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isSticky ? "justify-center" : "justify-between"
            )}
          >
            {shouldShowYoutubeInfo ? (
              <div className="bg-background/80 flex max-w-[70%] items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 shadow-md backdrop-blur-sm">
                <Image
                  src={youtubeMetadata.channelProfileUrl!}
                  alt={youtubeMetadata.channelName!}
                  wrapperClassName="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0"
                  imgClassName="object-cover"
                  fit="cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {youtubeMetadata.channelName}
                  </span>
                  {youtubeMetadata.subscriberCount && (
                    <span className="text-xs text-gray-600">
                      구독자{" "}
                      {formatSubscriberCount(youtubeMetadata.subscriberCount)}
                    </span>
                  )}
                </div>
                {youtubeMetadata.channelId && (
                  <a
                    href={`https://www.youtube.com/channel/${youtubeMetadata.channelId}?sub_confirmation=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                  >
                    구독
                  </a>
                )}
              </div>
            ) : (
              !isSticky && <div />
            )}

            <Button
              variant="secondary"
              size={isSticky ? "icon" : "default"}
              onClick={toggleSticky}
              className={cn(
                "cursor-pointer shadow-md backdrop-blur-sm transition-all",
                isSticky
                  ? "bg-primary/80 hover:bg-primary/90 text-primary-foreground border-primary h-10 w-10 rounded-full"
                  : "bg-olive-light hover:bg-olive-medium text-white rounded-2xl px-3 py-2"
              )}
              aria-label={isSticky ? "영상 고정 해제" : "영상 고정"}
            >
              <div
                className={cn(
                  "flex items-center justify-center gap-1 transition-transform duration-300",
                  isSticky && "rotate-45"
                )}
              >
                {!isSticky && (
                  <span className="text-sm font-medium">영상 고정</span>
                )}
                <Pin
                  className={cn(
                    "h-5 w-5 fill-current transition-all",
                    isSticky ? "text-primary-foreground" : "text-red-400"
                  )}
                />
              </div>
            </Button>
          </div>

          <div
            className={cn(
              "bg-card relative overflow-hidden rounded-xl border shadow-sm transition-all",
              isSticky && "shadow-2xl"
            )}
          >
            <YouTubeVideoPlayer ref={playerRef} videoUrl={videoUrl} />
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute z-20 right-2 bottom-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              <YouTubeIconBadge className="h-5 w-5" />
              <span>원본 영상</span>
            </a>
          </div>
          {!isSticky && (
            <div className="flex flex-col items-center justify-center">
              <p className="mt-2 text-center text-xs text-gray-500">
                이 영상은 유튜브 공식 플레이어로 재생되며,
              </p>
              <p className="text-center text-xs text-gray-500">
                조회수와 수익은 100% 원작자에게 돌아갑니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {children}
    </VideoPlayerContext.Provider>
  );
}

export { parseTimelineToSeconds };
export type { RecipeVideoSectionProps };
