"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ToastType } from "../model/types";
import { useToastStore } from "../model/store";
import { Image } from "@/shared/ui/image";
import { getYouTubeThumbnailUrls } from "@/shared/lib/youtube/getYouTubeThumbnail";

type RichToastProps = ToastType;

const SWIPE_THRESHOLD = 100;
const TRANSITION_DURATION = 300;
const MAX_TOAST_DURATION = 30000;

const extractVideoIdFromThumbnail = (thumbnailUrl: string): string | null => {
  const match = thumbnailUrl.match(/\/vi\/([^/]+)\//);
  return match ? match[1] : null;
};

export const RichToast = ({
  id,
  richContent,
  action,
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

  const thumbnailUrls = useMemo(() => {
    if (!richContent?.thumbnail) return [];

    const videoId = extractVideoIdFromThumbnail(richContent.thumbnail);
    if (videoId) {
      return [richContent.thumbnail, ...getYouTubeThumbnailUrls(videoId)];
    }
    return [richContent.thumbnail];
  }, [richContent?.thumbnail]);

  const effectiveDuration = Math.min(duration, MAX_TOAST_DURATION);

  useEffect(() => {
    if (persistent) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, effectiveDuration - TRANSITION_DURATION);

    const removeTimer = setTimeout(() => {
      removeToast(id);
    }, effectiveDuration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, effectiveDuration, persistent, removeToast]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeToast(id);
    }, TRANSITION_DURATION);
  };

  const handleActionClick = () => {
    if (action?.onClick) {
      action.onClick();
    }
    if (dismissible === "action" || dismissible === "both") {
      handleDismiss();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (dismissible !== "swipe" && dismissible !== "both") return;
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentY.current = e.touches[0].clientY;
    const offset = currentY.current - startY.current;
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > SWIPE_THRESHOLD) {
      handleDismiss();
    } else {
      setDragOffset(0);
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
      handleDismiss();
    } else {
      setDragOffset(0);
    }
  };

  const opacity = Math.max(0, 1 - dragOffset / 200);
  const isClickable = Boolean(richContent?.recipeId);
  const recipeUrl = richContent?.recipeId
    ? `/recipes/${richContent.recipeId}`
    : undefined;

  const toastContent = (
    <div
      className={cn(
        "pointer-events-auto z-30 rounded-2xl bg-white shadow-2xl relative",
        "md:border-olive-mint/60 w-full px-4 py-3 md:w-96 md:border-1 md:p-6",
        !isDragging && "transition-transform duration-300 ease-out",
        isVisible && dragOffset === 0 && "animate-slideInUp",
        !isVisible && dragOffset === 0 && "animate-slideOutDown",
        isClickable && "cursor-pointer"
      )}
      style={{
        transform: `translateY(${dragOffset}px)`,
        opacity: isDragging ? opacity : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Close button - desktop only */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDismiss();
        }}
        className="hidden md:flex absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        aria-label="닫기"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        {thumbnailUrls.length > 0 && (
          <div className="flex-shrink-0">
            <Image
              src={thumbnailUrls}
              alt="thumbnail"
              fit="cover"
              aspectRatio="1 / 1"
              wrapperClassName="h-16 w-16 rounded-lg  md:h-28 md:w-28"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1">
          {richContent?.title && (
            <div className="flex items-center gap-2 text-base leading-snug font-bold">
              {richContent.badgeIcon}
              <span>{richContent.title}</span>
            </div>
          )}
          {richContent?.subtitle && (
            <p className="truncate text-sm leading-snug text-gray-600">
              {richContent.subtitle}
            </p>
          )}
        </div>

        {action && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleActionClick();
            }}
            className="hover:text-olive-light flex flex-shrink-0 items-center gap-1 transition-colors"
            aria-label={action.label}
          >
            <span className="text-sm font-semibold">{action.label}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  return isClickable && recipeUrl ? (
    <Link href={recipeUrl}>{toastContent}</Link>
  ) : (
    toastContent
  );
};
