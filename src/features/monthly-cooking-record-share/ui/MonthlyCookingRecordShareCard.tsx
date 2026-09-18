import type { Ref } from "react";

import { Image } from "@/shared/ui/image/Image";

import {
  SavedCookingRecordPhoto,
  type StickerBookBackground,
} from "@/entities/recipe";

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
  const layoutWidth =
    layout.columns * layout.itemSize + Math.max(layout.columns - 1, 0);

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

      <div className="absolute top-[68px] right-1.5 bottom-[26px] left-1.5 z-10 flex items-center justify-center">
        <div
          data-testid="monthly-cooking-record-share-grid"
          className="flex max-w-full flex-wrap content-center justify-center gap-px"
          style={{ width: layoutWidth }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.id}
              data-share-sticker="true"
              className="flex shrink-0 items-center justify-center"
              style={{
                flexBasis: layout.itemSize,
                width: layout.itemSize,
                height: layout.itemSize,
              }}
            >
              {item.record ? (
                <SavedCookingRecordPhoto record={item.record} alt="" />
              ) : (
                <Image
                  src={item.imageUrl}
                  alt=""
                  lazy={false}
                  fit="contain"
                  wrapperClassName="h-full w-full overflow-visible"
                  imgClassName="select-none object-contain drop-shadow-[0_4px_5px_rgb(34_34_34/0.13)]"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <span className="text-ink-sub absolute right-3.5 bottom-2.5 z-10 text-xs font-bold tracking-[0.05em]">
        {brandLabel}
      </span>
    </div>
  );
};
