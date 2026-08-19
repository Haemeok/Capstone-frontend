"use client";

import { ChevronRight } from "lucide-react";

import { format, LocalizedLink, type UserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type {
  CookingRecordListItem,
  StickerBookBackground,
} from "@/entities/recipe";

import styles from "./CookingRecordPreview.module.css";

type CookingRecordPreviewBoardProps = {
  monthKey: string;
  monthLabel: string;
  records: CookingRecordListItem[];
  totalRecordCount: number;
  background: StickerBookBackground | null;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  onAddRecord: () => void;
};

export const CookingRecordPreviewBoard = ({
  monthKey,
  monthLabel,
  records,
  totalRecordCount,
  background,
  copy,
  onAddRecord,
}: CookingRecordPreviewBoardProps) => {
  const href = `/calendar/timeline?month=${monthKey}`;
  return (
    <div
      role="region"
      aria-label={format(copy.boardLabel, { month: monthLabel })}
      className={cn(
        "rounded-card relative mt-4 min-h-48 overflow-hidden px-3 py-3",
        !background?.imageUrl && styles.dot
      )}
    >
      {background?.imageUrl ? (
        <div
          data-testid="profile-cooking-record-background-layer"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Image
            src={background.imageUrl}
            alt=""
            fit="cover"
            lazy={false}
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
            imgClassName="object-cover object-center"
          />
        </div>
      ) : null}

      {totalRecordCount > 0 ? (
        <div className="relative grid grid-cols-4 gap-x-1 gap-y-3">
          {records.map((record) => (
            <div
              key={record.recordId}
              data-testid="cooking-record-preview-sticker"
              className={cn(
                "relative min-w-0 pb-5 text-center",
                styles.sticker
              )}
            >
              <Image
                src={record.stickerImageUrl ?? record.imageUrl ?? ""}
                alt={record.displayTitle}
                fit="contain"
                lazy={false}
                wrapperClassName="mx-auto h-16 w-full overflow-visible"
                imgClassName="drop-shadow-[0_5px_5px_rgb(34_34_34/0.14)]"
              />
              <span className="text-ink absolute bottom-1 left-1/2 max-w-[calc(100%-0.25rem)] -translate-x-1/2 truncate rounded-full bg-white px-2 py-1 text-xs font-semibold shadow-[0_2px_8px_rgb(34_34_34/0.14)]">
                {record.displayTitle}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-card relative mx-2 my-1 flex min-h-36 flex-col items-center justify-center bg-white/88 p-5 text-center backdrop-blur-[3px]">
          <p className="text-ink text-base font-semibold">
            {copy.state.emptyTitle}
          </p>
          <p className="text-ink-muted mt-1 text-sm">
            {copy.state.emptyDescription}
          </p>
          <button
            type="button"
            className="bg-olive-light active:bg-olive-dark mt-4 min-h-11 rounded-xl px-6 text-sm font-bold text-white"
            onClick={() => {
              triggerHaptic("Medium");
              onAddRecord();
            }}
          >
            {copy.addRecord}
          </button>
        </div>
      )}

      {totalRecordCount > 0 ? (
        <LocalizedLink
          href={href}
          onClick={() => triggerHaptic("Light")}
          className="border-ink/10 text-ink-sub relative mt-2 flex min-h-10 items-center justify-center gap-0.5 border-t px-2 pt-2 text-sm font-semibold"
        >
          {copy.previewViewAll}
          <ChevronRight aria-hidden="true" className="size-4" />
        </LocalizedLink>
      ) : null}
    </div>
  );
};
