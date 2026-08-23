"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { resolveChromeLocale, useUserPagesDict } from "@/shared/i18n";

import { ManualCookingRecordDrawer } from "@/features/cooking-record-create";

import { CookingRecordCalendar } from "./components/CookingRecordCalendar";
import { CookingRecordPreview } from "./components/CookingRecordPreview";
import { useProfileCookingRecords, useUserStreakQuery } from "./hooks";

const CalendarTabContent = () => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
        onAddRecord={() => setIsCreateOpen(true)}
      />
      <CookingRecordCalendar
        month={currentMonth}
        locale={locale}
        summaries={recordsQuery.dailySummaries}
        streakCount={streakQuery.data?.streak ?? 0}
        copy={copy.calendar}
        onMonthChange={setCurrentMonth}
      />
      <ManualCookingRecordDrawer
        isOpen={isCreateOpen}
        copy={copy.calendar.cookingRecord.create}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};

export default CalendarTabContent;
