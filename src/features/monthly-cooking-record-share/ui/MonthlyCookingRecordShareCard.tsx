import type { Ref } from "react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { StickerBookBackground } from "@/entities/recipe";

import {
  getMonthlyShareLayout,
  selectMonthlyShareItems,
} from "../model/shareLayout";
import type { MonthlyCookingRecordShareItem } from "../model/types";

type MonthlyCookingRecordShareCardProps = {
  ariaLabel: string;
  kicker: string;
  monthLabel: string;
  recordCountLabel: string;
  brandLabel: string;
  items: MonthlyCookingRecordShareItem[];
  background: StickerBookBackground | null;
  captureRef?: Ref<HTMLDivElement>;
};

const COLUMN_CLASS_NAMES = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
} as const;

const ITEM_SIZE_CLASS_NAMES = {
  hero: "h-32",
  spacious: "h-28",
  regular: "h-20",
  compact: "h-12",
  dense: "h-10",
} as const;

const ROTATION_CLASS_NAMES = [
  "-rotate-2",
  "rotate-2",
  "-rotate-1",
  "rotate-1",
] as const;

export const MonthlyCookingRecordShareCard = ({
  ariaLabel,
  kicker,
  monthLabel,
  recordCountLabel,
  brandLabel,
  items,
  background,
  captureRef,
}: MonthlyCookingRecordShareCardProps) => {
  const visibleItems = selectMonthlyShareItems(items);
  const layout = getMonthlyShareLayout(visibleItems.length);

  return (
    <div
      ref={captureRef}
      role="img"
      aria-label={ariaLabel}
      data-share-image="monthly-cooking-record"
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f4f4ef] bg-[radial-gradient(circle,#d7d8d1_1px,transparent_1.1px)] bg-[length:13px_13px] shadow-[0_8px_24px_rgb(34_34_34/0.1)]"
    >
      {background?.imageUrl ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={background.imageUrl}
            alt=""
            lazy={false}
            fit="cover"
            wrapperClassName="h-full w-full"
            imgClassName="object-cover object-top"
          />
        </div>
      ) : null}

      <div className="absolute top-4.5 right-4.5 left-4.5 z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-ink-muted block text-[10px] font-bold tracking-[0.04em]">
            {kicker}
          </span>
          <h2 className="text-ink mt-0.5 truncate text-[19px] leading-[1.3] font-bold tracking-[-0.035em]">
            {monthLabel}
          </h2>
        </div>
        <span className="text-ink-sub shrink-0 rounded-lg bg-white/85 px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-[2px]">
          {recordCountLabel}
        </span>
      </div>

      <div
        data-testid="monthly-cooking-record-share-grid"
        className={cn(
          "absolute top-18 right-3.5 bottom-7 left-3.5 z-10 grid content-center items-center justify-items-center",
          COLUMN_CLASS_NAMES[layout.columns]
        )}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex w-full items-center justify-center",
              ITEM_SIZE_CLASS_NAMES[layout.density],
              ROTATION_CLASS_NAMES[index % ROTATION_CLASS_NAMES.length]
            )}
          >
            <Image
              src={item.imageUrl}
              alt=""
              lazy={false}
              fit="contain"
              wrapperClassName="h-full w-full overflow-visible"
              imgClassName="select-none object-contain drop-shadow-[0_4px_5px_rgb(34_34_34/0.13)]"
            />
          </div>
        ))}
      </div>

      <span className="text-ink-sub absolute right-3.5 bottom-2.5 z-10 text-xs font-bold tracking-[0.05em]">
        {brandLabel}
      </span>
    </div>
  );
};
