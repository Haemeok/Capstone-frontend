"use client";

import { isSameMonth } from "date-fns";
import { ChevronRight } from "lucide-react";

import {
  format,
  type Locale,
  LocalizedLink,
  plural,
  type UserPagesDict,
} from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type { CookingRecordListItem } from "@/entities/recipe";

type CookingRecordPreviewProps = {
  month: Date;
  locale: Locale;
  records: CookingRecordListItem[];
  copy: UserPagesDict["calendar"]["cookingRecord"];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onAddRecord: () => void;
};

const PREVIEW_LIMIT = 7;

export const CookingRecordPreview = ({
  month,
  locale,
  records,
  copy,
  isPending,
  isError,
  onRetry,
  onAddRecord,
}: CookingRecordPreviewProps) => {
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    month
  );
  const titleTemplate = isSameMonth(month, new Date())
    ? copy.summary.currentTitle
    : copy.summary.selectedMonthTitle;
  const title = format(plural(records.length, titleTemplate), {
    count: records.length,
    month: monthLabel,
  });
  const previewRecords = records
    .filter((record) => record.stickerImageUrl || record.imageUrl)
    .slice(0, PREVIEW_LIMIT);

  if (isPending) {
    return (
      <section className="min-h-56 px-5 pt-7" aria-busy="true">
        <div className="h-7 w-52 animate-pulse rounded-md bg-gray-100" />
        <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-5">
          {Array.from({ length: 7 }, (_, index) => (
            <div
              key={index}
              className="rounded-card h-20 animate-pulse bg-gray-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
        <p className="text-ink-sub text-sm">{copy.state.error}</p>
        <button
          type="button"
          className="text-ink mt-3 rounded-lg px-4 py-2 text-sm font-semibold"
          onClick={() => {
            triggerHaptic("Light");
            onRetry();
          }}
        >
          {copy.state.retry}
        </button>
      </section>
    );
  }

  return (
    <section className="px-5 pt-7">
      <div className="flex items-center justify-between gap-4">
        {records.length > 0 ? (
          <h2 className="text-ink text-xl font-bold tracking-tight">{title}</h2>
        ) : null}
        {records.length > 0 ? (
          <LocalizedLink
            href={`/calendar/timeline?month=${monthKey}`}
            onClick={() => triggerHaptic("Light")}
            className="text-ink-sub flex shrink-0 items-center gap-0.5 py-2 text-sm font-medium"
          >
            {copy.viewAll}
            <ChevronRight className="size-4" />
          </LocalizedLink>
        ) : null}
      </div>

      {previewRecords.length > 0 ? (
        <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-5">
          {previewRecords.map((record) => (
            <div
              key={record.recordId}
              data-testid="cooking-record-preview-sticker"
              className="min-w-0 text-center"
            >
              <Image
                src={record.stickerImageUrl ?? record.imageUrl ?? ""}
                alt={record.displayTitle}
                fit="contain"
                lazy={false}
                wrapperClassName="mx-auto h-20 w-full overflow-visible"
                imgClassName="drop-shadow-[0_5px_5px_rgb(34_34_34/0.14)]"
              />
              <p className="text-ink mt-1 truncate text-xs font-semibold">
                {record.displayTitle}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-36 flex-col items-center justify-center text-center">
          <p className="text-ink text-base font-semibold">
            {copy.state.emptyTitle}
          </p>
          <p className="text-ink-muted mt-1 text-sm">
            {copy.state.emptyDescription}
          </p>
          <button
            type="button"
            className="bg-olive-light mt-5 min-h-11 rounded-lg px-6 text-sm font-bold text-white"
            onClick={() => {
              triggerHaptic("Medium");
              onAddRecord();
            }}
          >
            {copy.addRecord}
          </button>
        </div>
      )}
    </section>
  );
};
