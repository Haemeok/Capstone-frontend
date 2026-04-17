"use client";

import { useCallback,useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { getYouTubeThumbnailUrls } from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image";

import { useToastStore } from "../model/store";
import { ToastType } from "../model/types";

type RichToastProps = ToastType;

const SWIPE_THRESHOLD = 100;
const TRANSITION_DURATION = 300;
const MAX_TOAST_DURATION = 30000;
const CLOSE_BUTTON_DELAY_MS = 500;

const extractVideoIdFromThumbnail = (thumbnailUrl: string): string | null => {
  const match = thumbnailUrl.match(/\/vi\/([^/]+)\//);
  return match ? match[1] : null;
};

export const RichToast = ({
  id,
  richContent,
  persistent = false,
  dismissible = "both",
  duration = 5000,
}: RichToastProps) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [dismissType, setDismissType] = useState<"auto" | "button" | "swipe">(
    "auto"
  );
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(0);
  const timerStartRef = useRef(0);

  const thumbnailUrl = useMemo(() => {
    if (!richContent?.thumbnail) return undefined;

    const videoId = extractVideoIdFromThumbnail(richContent.thumbnail);
    if (videoId) {
      return getYouTubeThumbnailUrls(videoId)[0] ?? richContent.thumbnail;
    }
    return richContent.thumbnail;
  }, [richContent?.thumbnail]);

  const effectiveDuration = Math.min(duration, MAX_TOAST_DURATION);

  // Close button delayed fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, CLOSE_BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Pausable timer logic
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimers = useCallback(
    (remaining: number) => {
      timerStartRef.current = Date.now();
      remainingTimeRef.current = remaining;

      hideTimerRef.current = setTimeout(() => {
        setDismissType("auto");
        setIsVisible(false);
      }, remaining - TRANSITION_DURATION);

      removeTimerRef.current = setTimeout(() => {
        removeToast(id);
      }, remaining);
    },
    [id, removeToast]
  );

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
  }, []);

  useEffect(() => {
    if (persistent) return;
    startTimers(effectiveDuration);
    return clearTimers;
  }, [persistent, effectiveDuration, startTimers, clearTimers]);

  // Pause/Resume handlers
  const handlePause = useCallback(() => {
    if (persistent || isPaused) return;
    clearTimers();
    const elapsed = Date.now() - timerStartRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
    triggerHaptic("Light");
  }, [persistent, isPaused, clearTimers]);

  const handleResume = useCallback(() => {
    if (persistent || !isPaused) return;
    setIsPaused(false);
    if (remainingTimeRef.current > TRANSITION_DURATION) {
      startTimers(remainingTimeRef.current);
    }
  }, [persistent, isPaused, startTimers]);

  const handleDismiss = useCallback(
    (type: "auto" | "button" | "swipe" = "auto") => {
      clearTimers();
      setDismissType(type);
      setIsVisible(false);
      const exitDuration = type === "button" ? 200 : TRANSITION_DURATION;
      setTimeout(() => {
        removeToast(id);
      }, exitDuration);
    },
    [clearTimers, removeToast, id]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    handlePause();
    if (dismissible !== "swipe" && dismissible !== "both") return;
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    currentY.current = e.touches[0].clientY;
    const offset = currentY.current - startY.current;
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) {
      handleResume();
      return;
    }
    setIsDragging(false);

    if (dragOffset > SWIPE_THRESHOLD) {
      handleDismiss("swipe");
    } else {
      setDragOffset(0);
      handleResume();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (dismissible !== "swipe" && dismissible !== "both") return;
    setIsDragging(true);
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    currentY.current = e.clientY;
    const offset = currentY.current - startY.current;
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (dragOffset > SWIPE_THRESHOLD) {
      handleDismiss("swipe");
    } else {
      setDragOffset(0);
    }
  };

  const opacity = Math.max(0, 1 - dragOffset / 200);
  const isClickable = Boolean(richContent?.recipeId);
  const recipeUrl = richContent?.recipeId
    ? `/recipes/${richContent.recipeId}`
    : undefined;

  const handleLinkClick = () => {
    removeToast(id);
  };

  const toastContent = (
    <div
      className={cn(
        "pointer-events-auto relative z-30 rounded-2xl bg-white text-gray-900 border border-gray-100",
        isPaused
          ? "shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)]"
          : "shadow-lg md:shadow-md",
        "w-full px-4 py-3 md:w-96 md:p-6",
        !isDragging && "transition-transform duration-300 ease-out",
        isVisible && dragOffset === 0 && "animate-richToastIn",
        !isVisible &&
          dragOffset === 0 &&
          dismissType === "auto" &&
          "animate-richToastOut-auto",
        !isVisible &&
          dragOffset === 0 &&
          dismissType === "button" &&
          "animate-richToastOut-button",
        !isVisible &&
          dragOffset === 0 &&
          dismissType === "swipe" &&
          "animate-slideOutDown",
        isClickable && "cursor-pointer"
      )}
      style={{
        transform: `translateY(${dragOffset}px)${isPaused && !isDragging ? " scale(1.01)" : ""}`,
        opacity: isDragging ? opacity : 1,
        touchAction:
          dismissible === "swipe" || dismissible === "both" ? "none" : "auto",
        transition:
          isPaused && !isDragging
            ? "transform 0.15s ease-out, box-shadow 0.15s ease-out"
            : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Close button - mobile visible with fade-in */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDismiss("button");
        }}
        className={cn(
          "absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 md:top-3 md:right-3 md:h-auto md:w-auto md:bg-transparent",
          showCloseButton
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-80 opacity-0"
        )}
        style={{
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
        }}
        aria-label="닫기"
      >
        <X className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      <div className="flex min-w-0 items-center gap-3">
        {thumbnailUrl && (
          <div className="flex-shrink-0">
            <Image
              src={thumbnailUrl}
              alt="thumbnail"
              fit="cover"
              aspectRatio="1 / 1"
              wrapperClassName="h-16 w-16 rounded-lg  md:h-28 md:w-28"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
          {richContent?.title && (
            <div className="flex items-start gap-2 text-base leading-snug font-bold text-gray-900">
              {richContent.badgeIcon}
              <span className="min-w-0 line-clamp-2">{richContent.title}</span>
            </div>
          )}
          {richContent?.subtitle && (
            <p className="truncate text-sm leading-snug text-gray-600">
              {richContent.subtitle}
            </p>
          )}
        </div>

      </div>

      {/* Progress bar */}
      {!persistent && (
        <div className="absolute right-4 bottom-0 left-4 h-0.5 overflow-hidden rounded-full">
          <div
            className="h-full w-full origin-left rounded-full bg-olive-light"
            style={{
              animation: `richToastProgress ${effectiveDuration}ms linear forwards`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      )}
    </div>
  );

  return isClickable && recipeUrl ? (
    <Link
      href={recipeUrl}
      className="w-full min-w-0"
      onClick={handleLinkClick}
    >
      {toastContent}
    </Link>
  ) : (
    toastContent
  );
};
