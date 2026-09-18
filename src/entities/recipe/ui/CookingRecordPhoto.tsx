"use client";

import { Image } from "@/shared/ui/image/Image";
import { CroppedPhoto } from "@/shared/ui/image-crop-editor";

import {
  RECORD_MASK_PATHS,
  STICKER_MASK_PATH,
} from "../model/recordMaskShapes";
import type { RecordPhotoView } from "../model/recordPhoto.types";

type Props = { view: RecordPhotoView; alt: string; emptyLabel: string };
export const CookingRecordPhoto = ({
  view: { photo, plate },
  alt,
  emptyLabel,
}: Props) => {
  const isSticker = photo.shape.kind === "sticker";
  const src = (isSticker ? photo.stickerUrl : null) ?? photo.originalUrl;
  const maskPath =
    photo.shape.kind === "mask"
      ? RECORD_MASK_PATHS[photo.shape.value]
      : STICKER_MASK_PATH;
  return (
    <div
      className="relative isolate grid aspect-square w-full place-items-center"
      role="img"
      aria-label={alt}
    >
      {plate ? (
        <div
          className="pointer-events-none absolute -inset-[9%]"
          aria-hidden="true"
        >
          <Image
            src={plate.imageUrl}
            alt=""
            lazy={false}
            fit="contain"
            wrapperClassName="h-full w-full"
            skeleton={<span />}
            errorFallback={<span />}
          />
        </div>
      ) : null}
      <div
        className={`relative aspect-square ${plate ? "w-[75%]" : "w-[88%]"}`}
      >
        {src && isSticker ? (
          <Image
            src={src}
            alt=""
            lazy={false}
            fit="contain"
            wrapperClassName="h-full w-full"
            skeleton={<span />}
            errorFallback={<span />}
          />
        ) : src ? (
          <CroppedPhoto
            src={src}
            imageSize={
              isSticker
                ? (photo.stickerImageSize ?? photo.imageSize)
                : photo.imageSize
            }
            crop={photo.crop}
            maskPath={maskPath}
            alt=""
            errorFallback={
              <span className="text-ink-muted absolute inset-0 grid place-items-center p-3 text-center text-xs">
                {emptyLabel}
              </span>
            }
          />
        ) : (
          <div className="text-ink-muted flex h-full items-center justify-center rounded-2xl bg-gray-50 p-3 text-center text-xs">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
};
