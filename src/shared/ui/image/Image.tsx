"use client";

import React, { forwardRef } from "react";
import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useImageWithFallback } from "@/shared/hooks/useImageWithFallback";
import { Skeleton } from "../shadcn/skeleton";
import { cn } from "@/shared/lib/utils";

type Fit = "cover" | "contain";

type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onLoad" | "onError" | "loading" | "src"
> & {
  src: string | string[];
  lazy?: boolean;
  priority?: boolean;
  aspectRatio?: `${number} / ${number}` | number;
  width?: number;
  height?: number;
  skeleton?: React.ReactNode;
  errorFallback?: React.ReactNode;
  inViewThreshold?: number;
  inViewRootMargin?: string;
  wrapperClassName?: string;
  skeletonClassName?: string;
  imgClassName?: string;
  fit?: Fit;
  onRetry?: () => void;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt = "이미지",
    lazy = true,
    priority = false,
    aspectRatio = "1 / 1",
    width,
    height,
    fit = "cover",
    skeleton,
    errorFallback,
    inViewThreshold,
    inViewRootMargin,
    wrapperClassName,
    skeletonClassName,
    imgClassName,
    onRetry,
    ...imgProps
  },
  forwardedRef
) {
  // 1. Viewport 감지
  const { ref: viewportRef, inView } = useInViewOnce({
    threshold: inViewThreshold,
    rootMargin: inViewRootMargin,
  });

  // 2. 이미지 로딩 로직 (전부 훅에 위임)
  const image = useImageWithFallback({
    src,
    lazy,
    priority,
    inView,
    onRetry,
  });

  // 3. 스타일 계산
  const wrapperStyle: React.CSSProperties = {
    ...(typeof width === "number" ? { width } : null),
    ...(typeof height === "number" ? { height } : null),
    aspectRatio: String(aspectRatio),
  };

  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  // 4. 렌더링 (순수 선언적)
  return (
    <div
      ref={viewportRef}
      style={wrapperStyle}
      className={`relative overflow-hidden ${wrapperClassName ?? ""}`}
    >
      {/* 로딩 중 스켈레톤 */}
      {image.status !== "loaded" &&
        (skeleton ?? <Skeleton className="absolute inset-0" />)}

      {/* 에러 폴백 */}
      {image.status === "error" &&
        (errorFallback ?? (
          <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400">
            이미지 로드 실패
          </div>
        ))}

      {/* 이미지 */}
      {image.src && (
        <img
          key={`${image.src}-${image.retryCount ?? 0}`}
          ref={forwardedRef}
          src={image.src}
          alt={alt}
          loading={priority ? "eager" : lazy ? "lazy" : undefined}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={image.onLoad}
          onError={image.onError}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-300",
            image.status === "loaded" ? "opacity-100" : "opacity-0",
            fitClass,
            imgClassName
          )}
          {...imgProps}
        />
      )}
    </div>
  );
});
