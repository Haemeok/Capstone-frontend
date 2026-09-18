"use client";

import type { ReactNode } from "react";
import { useId } from "react";

import {
  getCropImageStyle,
  type ImageSize,
  type PhotoCrop,
} from "@/shared/lib/image-crop";
import { Image } from "@/shared/ui/image/Image";

type CroppedPhotoProps = {
  src: string;
  imageSize: ImageSize;
  crop: PhotoCrop;
  maskPath: string;
  alt: string;
  errorFallback?: ReactNode;
  showCropBoundary?: boolean;
};

export const CroppedPhoto = ({
  src,
  imageSize,
  crop,
  maskPath,
  alt,
  errorFallback,
  showCropBoundary = false,
}: CroppedPhotoProps) => {
  const clipPathId = `crop-mask-${useId().replaceAll(":", "")}`;

  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path d={maskPath} transform="scale(0.01)" />
          </clipPath>
        </defs>
      </svg>
      {showCropBoundary ? (
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <Image
            src={src}
            alt=""
            lazy={false}
            draggable={false}
            wrapperClassName="absolute inset-0"
            skeleton={<span />}
            errorFallback={<span />}
            style={getCropImageStyle(imageSize, crop)}
          />
        </div>
      ) : null}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `url(#${clipPathId})` }}
      >
        <Image
          src={src}
          alt={alt}
          lazy={false}
          draggable={false}
          aspectRatio={1}
          fit="cover"
          wrapperClassName="absolute inset-0"
          imgClassName="pointer-events-none"
          skeleton={<span />}
          errorFallback={errorFallback ?? <span />}
          style={getCropImageStyle(imageSize, crop)}
        />
      </div>
      {showCropBoundary ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible fill-none"
        >
          <path
            d={maskPath}
            className="stroke-olive-light"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
    </div>
  );
};
