"use client";

import { useQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import { getCookingRecordCalendarDate } from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

export const useCookingRecordCalendarDateQuery = ({
  date,
  enabled,
}: {
  date: string;
  enabled: boolean;
}) => {
  const locale = useUserPagesLocale();
  return useQuery({
    queryKey: COOKING_RECORD_QUERY_KEYS.calendarDate(date, locale),
    queryFn: () => getCookingRecordCalendarDate({ date, locale }),
    enabled: enabled && date.length > 0,
    retry: false,
  });
};
