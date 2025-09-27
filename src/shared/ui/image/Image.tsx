"use client";

import React, { forwardRef, useMemo } from "react";
import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useImageStatus } from "@/shared/hooks/useImageStatus";
import { Skeleton } from "../shadcn/skeleton";

type Fit = "cover" | "contain";

type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onLoad" | "onError" | "loading"
> & {
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
  imgClassName?: string;
  fit?: Fit;
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
    imgClassName,
    ...imgProps
  },
  forwardedRef
) {
  const { ref: viewportRef, inView } = useInViewOnce({
    threshold: inViewThreshold,
    rootMargin: inViewRootMargin,
  });
  const actualSrc = useMemo(
    () => (lazy ? (inView ? src : undefined) : src),
    [lazy, inView, src]
  );

  const { status, handleImageLoad, handleImageError } = useImageStatus(
    typeof actualSrc === "string" ? actualSrc : undefined
  );

  const wrapperStyle: React.CSSProperties = {
    ...(typeof width === "number" ? { width } : null),
    ...(typeof height === "number" ? { height } : null),
    aspectRatio: String(aspectRatio),
  };

  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div
      ref={viewportRef}
      style={wrapperStyle}
      className={`relative overflow-hidden ${wrapperClassName ?? ""}`}
    >
      {status !== "loaded" &&
        (skeleton ?? <Skeleton className="absolute inset-0" />)}

      {status === "error" &&
        (errorFallback ?? (
          <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400">
            이미지 로드 실패
          </div>
        ))}

      <img
        ref={forwardedRef}
        src={actualSrc}
        alt={alt}
        loading={lazy ? "lazy" : priority ? "eager" : undefined}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`absolute inset-0 h-full w-full ${fitClass} transition-opacity duration-300 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        } ${imgClassName ?? ""}`}
        {...imgProps}
      />
    </div>
  );
});
