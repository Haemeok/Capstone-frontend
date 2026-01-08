"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { YouTubePlayer } from "@/shared/ui/shadcn/youtube-video-player";

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
  const videoId = extractYouTubeVideoId(videoUrl);

  useImperativeHandle(ref, () => ({
    seekTo: (amount: number, type: "seconds" | "fraction" = "seconds") => {
      if (!iframeRef.current) return;

      try {
        let seekSeconds = amount;

        if (type === "fraction") {
          // For fraction type, we'll need to get duration first
          // This is a limitation of iframe API - we'll default to treating it as seconds
          seekSeconds = amount;
        }

        // Use YouTube iframe postMessage API
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: "seekTo",
            args: [seekSeconds, true],
          }),
          "*"
        );

        // Auto-play after seeking
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
    },
    getInternalPlayer: () => {
      return iframeRef.current;
    },
  }));

  // Store iframe ref when component mounts and video is playing
  useEffect(() => {
    const findIframe = () => {
      const iframe = document.querySelector(
        `iframe[src*="youtube.com/embed/${videoId}"]`
      ) as HTMLIFrameElement | null;

      if (iframe) {
        iframeRef.current = iframe;

        // Enable YouTube iframe API
        if (iframe.src && !iframe.src.includes("enablejsapi=1")) {
          const url = new URL(iframe.src);
          url.searchParams.set("enablejsapi", "1");
          iframe.src = url.toString();
        }

        // Call onReady if provided
        if (onReady) {
          onReady();
        }
      }
    };

    // Try to find iframe immediately
    findIframe();

    // Also set up observer for when iframe is created
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
      videoId={videoId}
      title="Recipe Video"
      defaultExpanded={false}
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
