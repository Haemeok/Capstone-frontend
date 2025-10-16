"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import type { ImageProps as NextImageProps } from "next/image";

import { useImageStatus } from "@/shared/hooks/useImageStatus";
import { Skeleton } from "../shadcn/skeleton";

type OptimizedImageProps = Omit<NextImageProps, "onLoad" | "onError"> & {
  wrapperClassName?: string;
  skeleton?: React.ReactNode;
  errorFallback?: React.ReactNode;
  aspectRatio?: `${number} / ${number}` | number;
};

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  function OptimizedImage(
    {
      src,
      alt = "이미지",
      aspectRatio = "1 / 1",
      skeleton,
      errorFallback,
      wrapperClassName,
      className,
      ...nextImageProps
    },
    forwardedRef
  ) {
    const { status, handleImageLoad, handleImageError } = useImageStatus(
      typeof src === "string" ? src : undefined
    );

    const wrapperStyle: React.CSSProperties = {
      aspectRatio: String(aspectRatio),
    };

    return (
      <div
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

        <Image
          ref={forwardedRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`transition-opacity duration-300 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          } ${className ?? ""}`}
          {...nextImageProps}
        />
      </div>
    );
  }
);
