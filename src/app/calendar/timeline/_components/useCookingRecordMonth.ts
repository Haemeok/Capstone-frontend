"use client";

import { useSearchParams } from "next/navigation";

import { addMonths, format as formatDate, isSameMonth } from "date-fns";

import {
  resolveDateFnsLocale,
  useLocalizedRouter,
  useUserPagesLocale,
} from "@/shared/i18n";

import { getSelectedCookingRecordMonth } from "./cookingRecordPage.lib";

export const useCookingRecordMonth = () => {
  const searchParams = useSearchParams();
  const router = useLocalizedRouter();
  const locale = useUserPagesLocale();
  const selectedMonth = getSelectedCookingRecordMonth(
    searchParams.get("month"),
    new Date()
  );
  const monthKey = formatDate(selectedMonth, "yyyy-MM");
  const monthLabelPattern =
    locale === "en"
      ? "MMMM yyyy"
      : locale === "ja"
        ? "yyyy年M月"
        : "yyyy년 M월";
  const monthLabel = formatDate(selectedMonth, monthLabelPattern, {
    locale: resolveDateFnsLocale(locale),
  });

  const moveMonth = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(
      "month",
      formatDate(addMonths(selectedMonth, offset), "yyyy-MM")
    );
    router.replace(`/calendar/timeline?${params.toString()}`);
  };

  return {
    locale,
    router,
    selectedMonth,
    monthKey,
    monthLabel,
    isCurrentMonth: isSameMonth(selectedMonth, new Date()),
    moveToPreviousMonth: () => moveMonth(-1),
    moveToNextMonth: () => moveMonth(1),
  };
};
