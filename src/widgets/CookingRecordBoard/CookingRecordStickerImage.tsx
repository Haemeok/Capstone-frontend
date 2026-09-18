"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

export type CookingRecordStickerImageProps = {
  src: string;
  alt: string;
};

const STICKER_IMAGE_CLASS_NAME =
  "select-none object-contain drop-shadow-[0_6px_6px_rgb(34_34_34/0.14)]";

export const CookingRecordStickerImage = ({
  src,
  alt,
}: CookingRecordStickerImageProps) => {
  const [displayedSrc, setDisplayedSrc] = useState(src);
  const [visibleIncomingSrc, setVisibleIncomingSrc] = useState<string | null>(
    null
  );
  const incomingSrc = src === displayedSrc ? null : src;
  const isIncomingVisible = visibleIncomingSrc === incomingSrc;

  const handleTransitionEnd = () => {
    if (!incomingSrc || !isIncomingVisible) return;
    setDisplayedSrc(incomingSrc);
    setVisibleIncomingSrc(null);
  };

  return (
    <div className="relative mx-auto h-[122px] w-full">
      <Image
        src={displayedSrc}
        alt={alt}
        lazy={false}
        fit="contain"
        wrapperClassName="h-full w-full overflow-visible"
        imgClassName={STICKER_IMAGE_CLASS_NAME}
      />
      {incomingSrc ? (
        <div
          data-testid="cooking-record-incoming-image"
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            isIncomingVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={incomingSrc}
            alt={alt}
            lazy={false}
            fit="contain"
            onLoad={() => setVisibleIncomingSrc(incomingSrc)}
            wrapperClassName="h-full w-full overflow-visible"
            imgClassName={STICKER_IMAGE_CLASS_NAME}
          />
        </div>
      ) : null}
    </div>
  );
};
