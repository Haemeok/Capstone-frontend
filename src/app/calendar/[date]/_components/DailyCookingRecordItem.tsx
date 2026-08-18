"use client";

import { ChevronRight } from "lucide-react";

import type { UserPagesDict } from "@/shared/i18n";
import { format, LocalizedLink } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";
import { useCookingRecordDetailQuery } from "@/entities/recipe";

import { DailyCookingRecordNutrition } from "./DailyCookingRecordNutrition";

type DailyCookingRecordItemProps = {
  record: CookingRecordCalendarDateItem;
  index: number;
  detailEnabled: boolean;
  manualSourceLabel: string;
  copy: UserPagesDict["calendar"]["dailyRecord"]["list"];
  onElementChange: (element: HTMLElement | null) => void;
};

export const DailyCookingRecordItem = ({
  record,
  index,
  detailEnabled,
  manualSourceLabel,
  copy,
  onElementChange,
}: DailyCookingRecordItemProps) => {
  const { data: detail } = useCookingRecordDetailQuery({
    recordId: record.recordId,
    enabled: detailEnabled,
  });
  const review = detail?.recordMemo?.trim() || null;
  const recipeHref =
    detail?.recipeAvailable && detail.recipeId
      ? `/recipes/${encodeURIComponent(detail.recipeId)}`
      : null;

  return (
    <article
      ref={onElementChange}
      data-record-id={record.recordId}
      aria-label={format(copy.recordAria, { title: record.displayTitle })}
      className="scroll-mt-[152px] border-t-8 border-gray-50 px-[18px] py-[22px] first:border-t-0 first:pt-3"
    >
      <div className="grid grid-cols-[128px_1fr] gap-[15px]">
        {record.originalImageUrl ? (
          <Image
            src={record.originalImageUrl}
            alt={record.displayTitle}
            aspectRatio="1 / 1"
            wrapperClassName="size-32 rounded-xl"
          />
        ) : (
          <div
            role="img"
            aria-label={format(copy.photoUnavailableAria, {
              title: record.displayTitle,
            })}
            className="text-ink-muted flex size-32 items-center justify-center rounded-xl bg-gray-100 text-xs"
          >
            {copy.photoUnavailable}
          </div>
        )}

        <div className={cn("min-w-0 pt-1", !review && "self-center pt-0")}>
          <span className="text-ink-muted text-xs">
            <span>{format(copy.sequence, { order: index + 1 })}</span>
            {record.sourceType === "MANUAL" ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>{manualSourceLabel}</span>
              </>
            ) : null}
          </span>
          <h3 className="text-ink mt-1.5 text-xl leading-[1.32] font-bold tracking-[-0.035em]">
            {recipeHref ? (
              <LocalizedLink
                href={recipeHref}
                className="focus-visible:ring-olive-light inline-flex min-h-11 items-center gap-0.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span>{record.displayTitle}</span>
                <ChevronRight
                  aria-hidden="true"
                  className="text-ink-muted size-[18px] shrink-0"
                />
              </LocalizedLink>
            ) : (
              record.displayTitle
            )}
          </h3>
          {review ? (
            <p className="text-ink-sub mt-2 line-clamp-3 text-sm leading-[1.55]">
              {review}
            </p>
          ) : null}
        </div>
      </div>

      <DailyCookingRecordNutrition record={record} copy={copy} />
    </article>
  );
};
