"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import {
  YouTubePlayer,
  type YouTubePlayerRef,
} from "@/shared/ui/shadcn/youtube-video-player";

export type YouTubeVideoPlayerRef = {
  seekTo: (amount: number, type?: "seconds" | "fraction") => void;
  getInternalPlayer: () => HTMLIFrameElement | null;
};

type YouTubeVideoPlayerProps = {
  videoUrl: string;
  onReady?: () => void;
};

const extractYouTubeVideoId = (url: string): string => {
  try {
    const urlObj = new URL(url);

    // youtube.com format
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v") || "";
    }

    // youtu.be format
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.substring(1);
    }

    return "";
  } catch {
    return "";
  }
};

export const YouTubeVideoPlayer = forwardRef<
  YouTubeVideoPlayerRef,
  YouTubeVideoPlayerProps
>(({ videoUrl, onReady }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const internalPlayerRef = useRef<YouTubePlayerRef>(null);
  const pendingSeekRef = useRef<{
    amount: number;
    type: "seconds" | "fraction";
  } | null>(null);
  const videoId = extractYouTubeVideoId(videoUrl);

  const performSeek = (amount: number, type: "seconds" | "fraction") => {
    if (!iframeRef.current) return;

    try {
      let seekSeconds = amount;

      if (type === "fraction") {
        seekSeconds = amount;
      }

      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seekSeconds, true],
        }),
        "*"
      );

      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo",
            args: [],
          }),
          "*"
        );
      }, 100);
    } catch (error) {
      console.error("Failed to seek video:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    seekTo: (amount: number, type: "seconds" | "fraction" = "seconds") => {
      if (!iframeRef.current) {
        pendingSeekRef.current = { amount, type };
        internalPlayerRef.current?.play();
        return;
      }

      performSeek(amount, type);
    },
    getInternalPlayer: () => {
      return iframeRef.current;
    },
  }));

  useEffect(() => {
    const findIframe = () => {
      const iframe = document.querySelector(
        `iframe[src*="youtube.com/embed/${videoId}"]`
      ) as HTMLIFrameElement | null;

      if (iframe) {
        iframeRef.current = iframe;

       if (pendingSeekRef.current) {
          const { amount, type } = pendingSeekRef.current;
          pendingSeekRef.current = null;

          // Wait a bit for the iframe to be fully ready
          setTimeout(() => {
            performSeek(amount, type);
          }, 500);
        }

        if (onReady) {
          onReady();
        }
      }
    };

    findIframe();

    const observer = new MutationObserver(findIframe);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [videoId, onReady]);

  return (
    <YouTubePlayer
      ref={internalPlayerRef}
      videoId={videoId}
      defaultExpanded={false}
      expandButtonClassName="hidden"
    />
  );
});

YouTubeVideoPlayer.displayName = "YouTubeVideoPlayer";

export const parseTimelineToSeconds = (timeline: string): number => {
  const parts = timeline.split(":").map(Number);

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};
