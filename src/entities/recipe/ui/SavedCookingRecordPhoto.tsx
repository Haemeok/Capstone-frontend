"use client";

import { type SyntheticEvent, useId, useState } from "react";

import {
  getCropImageStyle,
  type ImageSize,
  type PhotoCrop,
} from "@/shared/lib/image-crop";
import { Image } from "@/shared/ui/image/Image";

import { RECORD_MASK_PATHS } from "../model/recordMaskShapes";
import type { RecordDisplayResponse } from "../model/recordPhoto.types";

export type SavedCookingRecord = RecordDisplayResponse & {
  originalImageUrl?: string | null;
  imageUrl?: string | null;
  stickerImageUrl?: string | null;
};

type SavedCookingRecordPhotoProps = {
  record: SavedCookingRecord;
  alt: string;
};

const DEFAULT_CROP: PhotoCrop = {
  centerX: 0.5,
  centerY: 0.5,
  zoom: 1,
};

const SavedDishSource = ({
  src,
  crop,
  maskShape,
  isCropped,
}: {
  src: string;
  crop: PhotoCrop;
  maskShape: NonNullable<
    NonNullable<RecordDisplayResponse["displayStyle"]>["maskShape"]
  >;
  isCropped: boolean;
}) => {
  const clipPathId = `saved-record-mask-${useId().replaceAll(":", "")}`;
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);

  if (isCropped) {
    return (
      <Image
        src={src}
        alt=""
        lazy={false}
        fit="contain"
        wrapperClassName="h-full w-full overflow-visible"
        imgClassName="select-none object-contain"
        skeleton={<span />}
        errorFallback={<span />}
      />
    );
  }

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const { naturalWidth, naturalHeight } = event.target;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setImageSize({ width: naturalWidth, height: naturalHeight });
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ visibility: imageSize ? "visible" : "hidden" }}
    >
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path d={RECORD_MASK_PATHS[maskShape]} transform="scale(0.01)" />
          </clipPath>
        </defs>
      </svg>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `url(#${clipPathId})` }}
      >
        <Image
          key={src}
          src={src}
          alt=""
          lazy={false}
          draggable={false}
          fit="cover"
          onLoad={handleLoad}
          wrapperClassName="absolute inset-0"
          imgClassName="pointer-events-none select-none"
          skeleton={<span />}
          errorFallback={<span />}
          style={imageSize ? getCropImageStyle(imageSize, crop) : undefined}
        />
      </div>
    </div>
  );
};

export const SavedCookingRecordPhoto = ({
  record,
  alt,
}: SavedCookingRecordPhotoProps) => {
  const isDish = record.displayMode === "DISH";
  const plateImageUrl = record.displayStyle?.plateImageUrl ?? null;
  const croppedImageUrl = record.croppedImageUrl ?? null;
  const originalImageUrl =
    record.originalImageUrl ??
    record.imageUrl ??
    record.stickerImageUrl ??
    null;
  const stickerImageUrl =
    record.stickerImageUrl ?? croppedImageUrl ?? originalImageUrl;
  const source = isDish
    ? (croppedImageUrl ?? originalImageUrl)
    : stickerImageUrl;
  const maskShape = record.displayStyle?.maskShape ?? "CIRCLE";
  const crop = record.displayStyle?.crop ?? DEFAULT_CROP;

  return (
    <div
      role="img"
      aria-label={alt}
      className="relative isolate grid h-full w-full place-items-center"
    >
      {source ? (
        isDish ? (
          <div className="relative aspect-square h-full max-h-full max-w-full">
            {plateImageUrl ? (
              <div
                data-testid="saved-cooking-record-plate"
                className="pointer-events-none absolute -inset-[9%]"
                aria-hidden="true"
              >
                <Image
                  src={plateImageUrl}
                  alt=""
                  lazy={false}
                  fit="contain"
                  wrapperClassName="h-full w-full overflow-visible"
                  skeleton={<span />}
                  errorFallback={<span />}
                />
              </div>
            ) : null}
            <div
              data-testid="saved-cooking-record-dish"
              className={`absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 ${
                plateImageUrl ? "w-[75%]" : "w-[88%]"
              }`}
            >
              <SavedDishSource
                key={`${source}:${croppedImageUrl ? "cropped" : "original"}`}
                src={source}
                crop={crop}
                maskShape={maskShape}
                isCropped={croppedImageUrl !== null}
              />
            </div>
          </div>
        ) : (
          <Image
            src={source}
            alt=""
            lazy={false}
            fit="contain"
            wrapperClassName="h-full w-full overflow-visible"
            imgClassName="select-none object-contain drop-shadow-[0_6px_6px_rgb(34_34_34/0.14)]"
            skeleton={<span />}
            errorFallback={<span />}
          />
        )
      ) : (
        <span className="h-full w-full rounded-xl bg-gray-100" />
      )}
    </div>
  );
};
