"use client";

import type { ReactNode } from "react";

import { Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type {
  CookingRecordBackground,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

export type CookingRecordBoardProps = {
  ariaLabel: string;
  records: CookingRecordStickerItem[];
  background: CookingRecordBackground;
  addRecordLabel: string;
  getRecordLabel: (record: CookingRecordStickerItem) => string;
  onSelectRecord: (record: CookingRecordStickerItem) => void;
  onAddRecord: () => void;
  children?: ReactNode;
};

export const CookingRecordBoard = (props: CookingRecordBoardProps) => {
  const {
    ariaLabel,
    records,
    background,
    addRecordLabel,
    getRecordLabel,
    onSelectRecord,
    onAddRecord,
    children,
  } = props;

  const backgroundClassName = getBackgroundClassName(background);
  const backgroundStyle =
    background.kind === "custom"
      ? {
          backgroundImage: `linear-gradient(rgb(255 255 255 / 22%), rgb(255 255 255 / 22%)), url(${JSON.stringify(background.imageUrl)})`,
        }
      : undefined;

  return (
    <section
      role="region"
      aria-label={ariaLabel}
      style={backgroundStyle}
      className={cn(
        "relative min-h-[calc(100dvh-10.25rem)] transition-colors duration-200",
        backgroundClassName
      )}
    >
      <div
        data-testid="cooking-record-sticker-grid"
        className="grid grid-cols-3 gap-x-1.5 gap-y-4.5 px-3.5 pt-5.5 pb-32"
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
              "focus-visible:outline-olive-dark min-w-0 cursor-pointer rounded-2xl transition-[opacity,transform] duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2",
              styles.sticker
            )}
          >
            <Image
              src={record.imageUrl}
              alt={record.imageAlt}
              aspectRatio="1 / 1"
              fit="contain"
              wrapperClassName="mx-auto h-28 w-full overflow-visible"
              imgClassName="select-none object-contain drop-shadow-[0_6px_6px_rgb(34_34_34/0.14)]"
            />
          </button>
        ))}
        {children ? <div className="col-span-full">{children}</div> : null}
      </div>

      <button
        type="button"
        onClick={onAddRecord}
        className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark sticky bottom-24 z-10 mx-4 mb-4 flex min-h-12.5 w-[calc(100%-2rem)] cursor-pointer items-center justify-center gap-2 rounded-[13px] text-[15px] font-bold text-white shadow-[0_7px_20px_rgb(88_113_79/0.2)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Plus aria-hidden="true" className="size-[18px]" />
        {addRecordLabel}
      </button>
    </section>
  );
};

const getBackgroundClassName = (background: CookingRecordBackground) => {
  if (background.kind === "dot") return styles.dot;
  if (background.kind === "linen") return styles.linen;
  if (background.kind === "tile") return styles.tile;
  if (background.kind === "wood") return styles.wood;
  return styles.custom;
};
