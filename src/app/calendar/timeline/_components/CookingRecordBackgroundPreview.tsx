import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { StickerBookBackground } from "@/entities/recipe";

import type { CookingRecordStickerItem } from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

type CookingRecordBackgroundPreviewProps = {
  background: StickerBookBackground | null;
  records: CookingRecordStickerItem[];
  label: string;
};

export const CookingRecordBackgroundPreview = ({
  background,
  records,
  label,
}: CookingRecordBackgroundPreviewProps) => (
  <div
    aria-label={label}
    className={cn(
      "relative mt-4.5 h-36 overflow-hidden rounded-2xl",
      styles.dot
    )}
  >
    {background?.imageUrl ? (
      <Image
        src={background.imageUrl}
        alt=""
        fit="cover"
        skeleton={<span aria-hidden="true" />}
        errorFallback={<span aria-hidden="true" />}
        wrapperClassName="absolute inset-0 h-full w-full"
        imgClassName="object-top"
      />
    ) : null}
    {records.slice(0, 2).map((record, index) => (
      <Image
        key={record.id}
        src={record.imageUrl}
        alt={record.imageAlt}
        aspectRatio="1 / 1"
        fit="contain"
        wrapperClassName={cn(
          "absolute z-10 h-20 w-24 overflow-visible",
          index === 0
            ? "top-5 left-[22%] -rotate-3"
            : "right-[20%] bottom-4 rotate-3"
        )}
        imgClassName="object-contain drop-shadow-[0_5px_6px_rgb(34_34_34/0.16)]"
      />
    ))}
  </div>
);
