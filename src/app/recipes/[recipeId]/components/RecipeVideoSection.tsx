"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Pin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
      <section className={cn("my-6", isSticky && "invisible")}>
        <div className="relative">
          <YouTubeVideoPlayer ref={playerRef} videoUrl={videoUrl} />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -top-11 right-0 w-fit"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleSticky}
              className={cn(
                "bg-background/80 hover:bg-background/90 w-full cursor-pointer rounded-2xl px-3 py-2 shadow-md backdrop-blur-sm transition-colors",
                isSticky && "bg-primary/80 hover:bg-primary/90"
              )}
              aria-label={"영상 고정"}
            >
              <motion.div
                animate={{ rotate: isSticky ? 45 : 0 }}
                className="flex items-center justify-center gap-1"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <p className="text-sm font-medium">영상 고정</p>
                <Pin
                  className={cn(
                    "h-5 w-5 transition-all",
                    isSticky && "text-primary-foreground fill-current"
                  )}
                />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 z-50 w-full md:max-w-3xl"
          >
            <div className="bg-card relative rounded-xl border shadow-2xl">
              <YouTubeVideoPlayer ref={playerRef} videoUrl={videoUrl} />

              {/* Pin button in sticky mode */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -top-12 right-1/2 translate-x-1/2"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleSticky}
                  className="bg-primary/80 hover:bg-primary/90 h-10 w-10 cursor-pointer rounded-full shadow-md backdrop-blur-sm"
                  aria-label="영상 고정 해제"
                >
                  <motion.div
                    animate={{ rotate: 45 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Pin className="text-primary-foreground h-5 w-5 fill-current" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </VideoPlayerContext.Provider>
  );
}

export { parseTimelineToSeconds };
export type { RecipeVideoSectionProps };
