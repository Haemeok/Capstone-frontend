"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  addMonths,
  format as formatDate,
  isBefore,
  isSameMonth,
  startOfMonth,
} from "date-fns";

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
  const [today] = useState(() => new Date());
  const selectedMonth = getSelectedCookingRecordMonth(
    searchParams.get("month"),
    today
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
    isCurrentMonth: isSameMonth(selectedMonth, today),
    isPastMonth: isBefore(selectedMonth, startOfMonth(today)),
    moveToPreviousMonth: () => moveMonth(-1),
    moveToNextMonth: () => moveMonth(1),
  };
};
