"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

const CountUp = dynamic(() => import("@/shared/ui/shadcn/CountUp"), {
  ssr: false,
});

type HeartButtonProps = {
  containerClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  onClick: () => void;
  isLiked: boolean;
  likeCount: number;
  isCountShown?: boolean;
  width?: number;
  height?: number;
  isOnNavbar?: boolean;
  defaultColorClass?: string;
};

const HeartButton = ({
  containerClassName = "",
  buttonClassName = "",
  iconClassName = "",
  onClick,
  isLiked,
  likeCount,
  isCountShown,
  width = 24,
  height = 24,
  isOnNavbar = false,
  defaultColorClass = "text-gray-400",
  ...props
}: HeartButtonProps) => {
  const prevLikeCountRef = useRef(likeCount);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const diff = Math.abs(likeCount - prevLikeCountRef.current);

    setShouldAnimate(diff > 1);
    prevLikeCountRef.current = likeCount;
  }, [likeCount]);

  const finalButtonClassName = clsx(
    isOnNavbar ? "nav-button-base" : "",
    `flex items-center justify-center ${buttonClassName}`
  );

  const [isBouncing, setIsBouncing] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    setIsBouncing(false);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBouncing(true);
    onClick();
  };

  const ariaLabel = isLiked ? "좋아요 취소" : "좋아요";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 ${containerClassName}`}
    >
      <button
        onClick={handleClick}
        className={cn("heart-button cursor-pointer", finalButtonClassName)}
        aria-label={ariaLabel}
        aria-pressed={isLiked}
        aria-describedby={isCountShown ? `like-count-${likeCount}` : undefined}
        {...props}
      >
        <Heart
          width={width}
          height={height}
          className={cn(
            "beat",
            isBouncing && "animate-heartbeat",
            iconClassName,
            isLiked ? "fill-red-500 text-red-500" : defaultColorClass
          )}
          onAnimationEnd={handleAnimationEnd}
        />
      </button>
      {isCountShown && (
        <span className="h-5 text-sm font-bold">
          {shouldAnimate ? (
            <CountUp
              to={likeCount}
              duration={0.15}
              className="text-sm font-bold"
              startWhen={true}
            />
          ) : (
            likeCount
          )}
        </span>
      )}
    </div>
  );
};

export default HeartButton;
