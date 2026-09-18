"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { format as formatDate } from "date-fns";

import { resolveChromeLocale, useUserPagesDict } from "@/shared/i18n";

import { ManualCookingRecordDrawer } from "@/features/cooking-record-create";
import { ConnectedCookingRecordPhotoField } from "@/features/cooking-record-photo-edit";

import { CookingRecordCalendar } from "./components/CookingRecordCalendar";
import { CookingRecordPreview } from "./components/CookingRecordPreview";
import { useProfileCookingRecords, useUserStreakQuery } from "./hooks";

const CalendarTabContent = () => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [initialCookedDate, setInitialCookedDate] = useState<string>();
  const pathname = usePathname();
  const locale = resolveChromeLocale(pathname ?? "/");
  const copy = useUserPagesDict();
  const streakQuery = useUserStreakQuery();
  const recordsQuery = useProfileCookingRecords({
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth() + 1,
  });

  return (
    <div className="w-full pb-8 md:pb-12">
      <CookingRecordPreview
        month={currentMonth}
        locale={locale}
        background={recordsQuery.background}
        records={recordsQuery.records}
        copy={copy.calendar.cookingRecord}
        isPending={recordsQuery.isPreviewPending}
        isError={recordsQuery.isPreviewError}
        onRetry={() => void recordsQuery.retryPreview()}
        onAddRecord={() => {
          setInitialCookedDate(undefined);
          setIsCreateOpen(true);
        }}
      />
      <CookingRecordCalendar
        month={currentMonth}
        locale={locale}
        summaries={recordsQuery.dailySummaries}
        stickerImageUrlByDate={recordsQuery.stickerImageUrlByDate}
        displayRecordByDate={recordsQuery.displayRecordByDate}
        hasCalendarData={recordsQuery.hasCalendarData}
        streakCount={streakQuery.data?.streak ?? 0}
        copy={copy.calendar}
        onMonthChange={setCurrentMonth}
        onAddRecord={(date) => {
          setInitialCookedDate(formatDate(date, "yyyy-MM-dd"));
          setIsCreateOpen(true);
        }}
      />
      <ManualCookingRecordDrawer
        isOpen={isCreateOpen}
        initialCookedDate={initialCookedDate}
        copy={copy.calendar.cookingRecord.create}
        photoEditor={ConnectedCookingRecordPhotoField}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};

export default CalendarTabContent;
