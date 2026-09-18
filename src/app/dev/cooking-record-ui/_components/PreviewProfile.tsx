"use client";

import { useState } from "react";

import type { Locale } from "@/shared/i18n";
import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import type { CookingRecordListItem } from "@/entities/recipe/model/record";
import { toRecordPhotoView } from "@/entities/recipe/model/recordPhotoView";
import { CookingRecordPhoto } from "@/entities/recipe/ui/CookingRecordPhoto";

import { CookingRecordCalendar } from "@/widgets/CalendarTabContent/components/CookingRecordCalendar";
import { CookingRecordPreviewBoard } from "@/widgets/CalendarTabContent/components/CookingRecordPreviewBoard";

import { previewCatalog } from "../_fixtures/catalog";
import type { PreviewRecord } from "../_fixtures/records";

type Props = {
  records: PreviewRecord[];
  locale: Locale;
  onAdd: (date?: string) => void;
  onViewAll: () => void;
};
const toListItem = (record: PreviewRecord): CookingRecordListItem => ({
  recordId: record.id,
  recipeId: null,
  displayTitle: record.title,
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: record.photo.originalUrl,
  visibility: null,
  stickerImageUrl: record.photo.stickerUrl,
  stickerStatus: "READY",
  cookedAt: record.date,
  createdAt: record.date,
  sourceType: "MANUAL",
  reviewId: null,
  recipeAvailable: false,
  savings: null,
  isRemix: false,
});
export const PreviewProfile = ({
  records,
  locale,
  onAdd,
  onViewAll,
}: Props) => {
  const [month, setMonth] = useState(() => new Date(2026, 8, 1));
  const copy = userPagesMessages[locale].calendar;
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const monthly = records.filter((record) => record.date.startsWith(monthKey));
  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(month);
  return (
    <div className="px-5 pb-8">
      <h2 className="pt-6 text-xl font-bold">{copy.cookingRecord.pageTitle}</h2>
      <CookingRecordPreviewBoard
        monthKey={monthKey}
        monthLabel={monthLabel}
        records={monthly.slice(0, 7).map(toListItem)}
        totalRecordCount={monthly.length}
        background={null}
        copy={copy.cookingRecord}
        onAddRecord={() => onAdd()}
        onViewAll={onViewAll}
        renderPhoto={(item) => {
          const record = monthly.find((row) => row.id === item.recordId);
          return record ? (
            <div className="mx-auto w-16">
              <CookingRecordPhoto
                view={toRecordPhotoView(record.photo, previewCatalog.plates)}
                alt={record.title}
                emptyLabel={recordPhotoMessages[locale].empty}
              />
            </div>
          ) : null;
        }}
      />
      <CookingRecordCalendar
        month={month}
        locale={locale}
        summaries={monthly.map((record) => ({
          date: record.date,
          totalSavings: 0,
          totalCount: 1,
          firstImageUrl: record.photo.originalUrl,
        }))}
        stickerImageUrlByDate={Object.fromEntries(
          monthly.map((record) => [
            record.date,
            record.photo.stickerUrl ?? record.photo.originalUrl ?? "",
          ])
        )}
        hasCalendarData
        streakCount={0}
        copy={copy}
        onMonthChange={setMonth}
        onAddRecord={(date) =>
          onAdd(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
          )
        }
      />
    </div>
  );
};
