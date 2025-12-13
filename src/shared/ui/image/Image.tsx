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
  skeletonClassName?: string;
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
    skeletonClassName,
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
    () => (priority ? src : (lazy ? (inView ? src : undefined) : src)),
    [priority, lazy, inView, src]
  );

  const { status, handleImageLoad, handleImageError, retryCount } =
    useImageStatus(typeof actualSrc === "string" ? actualSrc : undefined);

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
      {status !== "loaded" && !priority &&
        (skeleton ?? <Skeleton className="absolute inset-0" />)}

      {status === "error" &&
        (errorFallback ?? (
          <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400">
            이미지 로드 실패
          </div>
        ))}

      {actualSrc && (
        <img
          key={`${actualSrc}-retry-${retryCount}`}
          ref={forwardedRef}
          src={actualSrc}
          alt={alt}
          loading={priority ? "eager" : lazy ? "lazy" : undefined}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`absolute inset-0 h-full w-full ${fitClass} ${
            priority ? "" : "transition duration-300"
          } ${status === "loaded" ? "opacity-100" : "opacity-0"} ${imgClassName ?? ""}`}
          {...imgProps}
        />
      )}
    </div>
  );
});
