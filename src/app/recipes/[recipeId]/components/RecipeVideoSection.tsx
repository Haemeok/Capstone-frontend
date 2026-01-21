"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Pin } from "lucide-react";
import { motion } from "motion/react";

import {
  YouTubeVideoPlayer,
  parseTimelineToSeconds,
  type YouTubeVideoPlayerRef,
} from "@/shared/ui/YouTubeVideoPlayer";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

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
  if (videoUrl === "") {
    return <>{children}</>;
  }

  const playerRef = useRef<YouTubeVideoPlayerRef>(null);
  const [isSticky, setIsSticky] = useState(false);

  const seekToTimeline = (timeline: string) => {
    const seconds = parseTimelineToSeconds(timeline);

    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };

  const toggleSticky = () => {
    setIsSticky(!isSticky);
  };

  useEffect(() => {
    if (!youtubeMetadata?.channelId) return;

    const existingScript = document.querySelector(
      'script[src="https://apis.google.com/js/platform.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.gapi?.ytsubscribe) {
      window.gapi.ytsubscribe.go();
    }
  }, [youtubeMetadata?.channelId]);

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
            isSticky ? "my-6 block aspect-video" : "hidden h-0"
          )}
        />

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
              <div className="bg-background/80 flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 shadow-md backdrop-blur-sm">
                <Image
                  src={youtubeMetadata.channelProfileUrl!}
                  alt={youtubeMetadata.channelName!}
                  wrapperClassName="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0"
                  imgClassName="object-cover"
                  fit="cover"
                />
                <div className="flex min-w-0 flex-col">
                  <span className="line-clamp-1 text-sm font-medium">
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
                  <div
                    className="g-ytsubscribe shrink-0"
                    data-channelid={youtubeMetadata.channelId}
                    data-layout="default"
                    data-count="hidden"
                  />
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
              <motion.div
                animate={{ rotate: isSticky ? 45 : 0 }}
                className="flex items-center justify-center gap-1"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
              </motion.div>
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
