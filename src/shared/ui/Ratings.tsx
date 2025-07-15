"use client";

import React, { useEffect, useRef, useState } from "react";

import { formatPrice } from "@/shared/lib/format";

import StarIcon from "./StarIcon";

type Size = "sm" | "md" | "lg" | "xl";

type RatingProps = {
  starCount?: number;
  ratingCount?: number;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: Size;
  showValue?: boolean;
  precision?: number;
  allowHalf?: boolean;
  className?: string;
};

const Ratings = ({
  starCount = 5,
  ratingCount = 0,
  value = 0,
  onChange,
  readOnly = false,
  size = "lg",
  showValue = false,
  precision = 1,
  allowHalf = false,
  className = "",
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    starRefs.current = starRefs.current.slice(0, starCount);
  }, [starCount]);

  const sizeClasses: Record<Size, string> = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  };

  const roundToNearest = (val: number): number => {
    const inv = 1.0 / precision;
    return Math.round(val * inv) / inv;
  };

  const handleClick = (
    idx: number,
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (readOnly || !onChange) return;

    let newValue = idx + 1;

    if (allowHalf && starRefs.current[idx]) {
      const rect = starRefs.current[idx]?.getBoundingClientRect();
      if (rect) {
        const halfPoint = rect.left + rect.width / 2;

        if (event.clientX < halfPoint) {
          newValue = idx + 0.5;
        }
      }
    }

    const finalValue = Math.abs(value - newValue) < 0.1 ? 0 : newValue;
    onChange(roundToNearest(finalValue));
  };

  const handleMouseMove = (
    idx: number,
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (readOnly) return;

    let val = idx + 1;

    if (allowHalf && starRefs.current[idx]) {
      const rect = starRefs.current[idx]?.getBoundingClientRect();
      if (rect) {
        const halfPoint = rect.left + rect.width / 2;

        if (event.clientX < halfPoint) {
          val = idx + 0.5;
        }
      }
    }

    setHoverValue(val);
  };

  const handleMouseLeave = (): void => {
    if (readOnly) return;
    setHoverValue(0);
  };

  const ratingMessage = (value: number, count: number) => {
    if (count < 1) {
      return (
        <p className="mt-1 text-sm text-gray-400">
          아직 평가가 적어요. 평가를 남겨보세요 !
        </p>
      );
    }
    return (
      <div className="mt-1 flex items-center">
        <p className="text-olive-mint text-sm font-semibold">
          {formatPrice(count, "명")}명
        </p>
        <p className="text-sm text-gray-400">의 사람들이 평균</p>
        <p className="text-olive-mint ml-1 text-sm font-semibold">{value}점</p>
        <p className="text-sm text-gray-400">을 줬어요 !</p>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${className} gap-2`}
    >
      <div className="flex items-center gap-2">
        {[...Array(starCount)].map((_, idx) => {
          const starValue = idx + 1;
          const currentValue = hoverValue || value;

          const isFilled = currentValue >= starValue;

          const isHalfFilled =
            allowHalf &&
            currentValue >= starValue - 0.5 &&
            currentValue < starValue;

          return (
            <div
              key={idx}
              className={`${sizeClasses[size]} cursor-pointer`}
              ref={(el) => {
                starRefs.current[idx] = el;
              }}
              onClick={(e) => handleClick(idx, e)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              onMouseLeave={handleMouseLeave}
            >
              <StarIcon
                filled={isFilled}
                halfFilled={isHalfFilled}
                hovered={hoverValue > 0 && hoverValue >= starValue - 0.5}
              />
            </div>
          );
        })}
      </div>
      {showValue && ratingMessage(value, ratingCount)}
    </div>
  );
};

export default Ratings;
