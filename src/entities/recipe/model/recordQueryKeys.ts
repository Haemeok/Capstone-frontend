import type { Locale } from "@/shared/i18n";

import type { RecordSourceType } from "./record";

type CookingRecordListKeyParams = {
  sourceTypes?: RecordSourceType[];
  size: number;
  locale: Locale;
};

const normalizeSourceTypes = (sourceTypes?: RecordSourceType[]) =>
  sourceTypes === undefined ? undefined : [...sourceTypes].sort();

export const COOKING_RECORD_QUERY_KEYS = {
  all: ["cooking-record"] as const,
  lists: ["cooking-record", "list"] as const,
  list: ({ sourceTypes, size, locale }: CookingRecordListKeyParams) =>
    [
      "cooking-record",
      "list",
      { sourceTypes: normalizeSourceTypes(sourceTypes), size, locale },
    ] as const,
  details: ["cooking-record", "detail"] as const,
  detail: (recordId: string, locale: Locale) =>
    ["cooking-record", "detail", recordId, locale] as const,
  calendars: ["cooking-record", "calendar"] as const,
  calendarMonth: (year: number, month: number, locale: Locale) =>
    ["cooking-record", "calendar", "month", year, month, locale] as const,
  calendarDate: (date: string, locale: Locale) =>
    ["cooking-record", "calendar", "date", date, locale] as const,
};
