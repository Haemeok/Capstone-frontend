"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Pin } from "lucide-react";
import { motion } from "motion/react";

import {
  YouTubeVideoPlayer,
  parseTimelineToSeconds,
  type YouTubeVideoPlayerRef,
} from "@/shared/ui/YouTubeVideoPlayer";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/lib/utils";

type VideoPlayerContextType = {
  seekToTimeline: (timeline: string) => void;
};

const VideoPlayerContext = createContext<VideoPlayerContextType | null>(null);

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  return context;
};

type RecipeVideoSectionProps = {
  videoUrl: string;
  children?: React.ReactNode;
};

export default function RecipeVideoSection({
  videoUrl,
  children,
}: RecipeVideoSectionProps) {
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
              "bg-card relative overflow-hidden rounded-xl border shadow-sm transition-all",
              isSticky && "shadow-2xl"
            )}
          >
            <YouTubeVideoPlayer ref={playerRef} videoUrl={videoUrl} />
          </div>

          <motion.div
            layout
            className={cn(
              "absolute z-10 w-fit",
              isSticky ? "-top-12 left-1/2 -translate-x-1/2" : "-top-11 right-0"
            )}
          >
            <Button
              variant="secondary"
              size={isSticky ? "icon" : "default"}
              onClick={toggleSticky}
              className={cn(
                "cursor-pointer shadow-md backdrop-blur-sm transition-all",
                isSticky
                  ? "bg-primary/80 hover:bg-primary/90 text-primary-foreground h-10 w-10 rounded-full"
                  : "bg-background/80 hover:bg-background/90 rounded-2xl px-3 py-2"
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
                    isSticky && "text-primary-foreground"
                  )}
                />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </section>

      {children}
    </VideoPlayerContext.Provider>
  );
}

export { parseTimelineToSeconds };
export type { RecipeVideoSectionProps };
