"use client";

import type { ReactNode } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { StickerBookBackground } from "@/entities/recipe";

import { CookingRecordBottomActions } from "./CookingRecordBottomActions";
import { CookingRecordStickerImage } from "./CookingRecordStickerImage";
import type { CookingRecordStickerItem } from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

export type CookingRecordBoardProps = {
  ariaLabel: string;
  records: CookingRecordStickerItem[];
  background: StickerBookBackground | null;
  recordCountLabel: string;
  addRecordLabel: string;
  shareRecordLabel: string;
  getRecordLabel: (record: CookingRecordStickerItem) => string;
  onSelectRecord: (record: CookingRecordStickerItem) => void;
  onAddRecord: () => void;
  onShareRecord: () => void;
  showRecordMeta?: boolean;
  showRecordNames?: boolean;
  children?: ReactNode;
};

export const CookingRecordBoard = (props: CookingRecordBoardProps) => {
  const {
    ariaLabel,
    records,
    background,
    recordCountLabel,
    addRecordLabel,
    shareRecordLabel,
    getRecordLabel,
    onSelectRecord,
    onAddRecord,
    onShareRecord,
    showRecordMeta = true,
    showRecordNames = true,
    children,
  } = props;

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "relative flex-1 transition-colors duration-200",
        !background?.imageUrl && styles.dot
      )}
    >
      {background?.imageUrl ? (
        <div
          data-testid="cooking-record-background-layer"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Image
            src={background.imageUrl}
            alt=""
            fit="cover"
            skeleton={
              <span
                aria-hidden="true"
                className={cn("absolute inset-0", styles.dot)}
              />
            }
            errorFallback={
              <span
                aria-hidden="true"
                className={cn("absolute inset-0", styles.dot)}
              />
            }
            wrapperClassName="h-full w-full"
            imgClassName="object-cover object-top"
          />
        </div>
      ) : null}
      {showRecordMeta ? (
        <div className="relative flex h-10 items-center px-3.5">
          <span className="text-ink-sub rounded-lg bg-white/85 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur-[2px]">
            {recordCountLabel}
          </span>
        </div>
      ) : (
        <div className="relative h-5" aria-hidden="true" />
      )}
      <div
        data-testid="cooking-record-sticker-grid"
        className="relative grid grid-cols-3 gap-0 px-2 pt-2 pb-32"
      >
        {records.map((record) => (
          <button
            key={record.id}
            type="button"
            aria-label={getRecordLabel(record)}
            onClick={() => {
              triggerHaptic("Light");
              onSelectRecord(record);
            }}
            className={cn(
              "focus-visible:outline-olive-dark relative min-w-0 cursor-pointer rounded-2xl transition-[opacity,transform] duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2",
              styles.sticker
            )}
          >
            <CookingRecordStickerImage
              src={record.imageUrl}
              alt={record.imageAlt}
            />
            {showRecordNames ? (
              <span className="text-ink pointer-events-none absolute bottom-0 left-1/2 max-w-[calc(100%-0.5rem)] -translate-x-1/2 truncate rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-[0_2px_8px_rgb(34_34_34/0.14)]">
                {record.title}
              </span>
            ) : null}
          </button>
        ))}
        {children ? <div className="col-span-full">{children}</div> : null}
      </div>

      <CookingRecordBottomActions
        addLabel={addRecordLabel}
        shareLabel={shareRecordLabel}
        onAdd={onAddRecord}
        onShare={onShareRecord}
        showShare={showRecordMeta}
      />
    </section>
  );
};
