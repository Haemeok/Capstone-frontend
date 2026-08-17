"use client";

import { useQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import { getCookingRecordCalendarMonth } from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

export const useCookingRecordCalendarMonthQuery = ({
  year,
  month,
  enabled,
}: {
  year: number;
  month: number;
  enabled: boolean;
}) => {
  const locale = useUserPagesLocale();
  return useQuery({
    queryKey: COOKING_RECORD_QUERY_KEYS.calendarMonth(year, month, locale),
    queryFn: () => getCookingRecordCalendarMonth({ year, month, locale }),
    enabled,
    retry: false,
  });
};
