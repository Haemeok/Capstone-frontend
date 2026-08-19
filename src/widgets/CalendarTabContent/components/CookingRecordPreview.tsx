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

import type {
  CookingRecordListItem,
  StickerBookBackground,
} from "@/entities/recipe";

import { CookingRecordPreviewBoard } from "./CookingRecordPreviewBoard";

type CookingRecordPreviewProps = {
  month: Date;
  locale: Locale;
  records: CookingRecordListItem[];
  background: StickerBookBackground | null;
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
  background,
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
      <section className="min-h-64 px-5 pt-7" aria-busy="true">
        <div className="h-7 w-52 animate-pulse rounded-md bg-gray-100" />
        <div className="rounded-card mt-4 h-52 animate-pulse bg-gray-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
        <p className="text-ink-sub text-sm">{copy.state.error}</p>
        <button
          type="button"
          className="text-ink mt-3 min-h-11 rounded-lg px-4 text-sm font-semibold"
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
        <h2 className="text-ink text-xl font-bold tracking-tight">{title}</h2>
        <LocalizedLink
          href={`/calendar/timeline?month=${monthKey}`}
          onClick={() => triggerHaptic("Light")}
          className="text-ink-muted flex shrink-0 items-center gap-0.5 py-2 text-sm font-medium"
        >
          {copy.viewAll}
          <ChevronRight aria-hidden="true" className="size-4" />
        </LocalizedLink>
      </div>
      <p className="text-ink-muted mt-1 text-sm leading-6">
        {format(copy.previewCaption, { month: monthLabel })}
      </p>

      <CookingRecordPreviewBoard
        monthKey={monthKey}
        monthLabel={monthLabel}
        records={previewRecords}
        totalRecordCount={records.length}
        background={background}
        copy={copy}
        onAddRecord={onAddRecord}
      />
    </section>
  );
};
