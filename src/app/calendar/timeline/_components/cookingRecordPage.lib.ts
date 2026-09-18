import { format, isValid, parseISO, startOfMonth } from "date-fns";

import { type Locale, resolveDateFnsLocale } from "@/shared/i18n";

import type {
  CookingRecordListGroup,
  CookingRecordListItem,
} from "@/entities/recipe";

import type { CookingRecordStickerItem } from "./cookingRecordUi.types";

const MONTH_QUERY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export type MonthlyCookingRecord = {
  record: CookingRecordListItem;
  sticker: CookingRecordStickerItem;
};

export type MonthlyCookingRecordItem = {
  date: string;
  record: CookingRecordListItem;
};

export const getSelectedCookingRecordMonth = (
  monthQuery: string | null,
  fallbackDate: Date
): Date => {
  if (monthQuery && MONTH_QUERY_PATTERN.test(monthQuery)) {
    const parsedMonth = parseISO(`${monthQuery}-01`);
    if (isValid(parsedMonth)) return startOfMonth(parsedMonth);
  }
  return startOfMonth(fallbackDate);
};

export const toMonthlyCookingRecords = (
  groups: CookingRecordListGroup[],
  monthKey: string,
  locale: Locale
): MonthlyCookingRecord[] => {
  const records: MonthlyCookingRecord[] = [];

  for (const { date, record } of getMonthlyCookingRecordItems(
    groups,
    monthKey
  )) {
    const imageUrl = record.stickerImageUrl ?? record.imageUrl;
    if (!imageUrl) continue;
    records.push({
      record,
      sticker: {
        id: record.recordId,
        title: record.displayTitle,
        cookedAtLabel: formatRecordDate(date, locale),
        imageUrl,
        imageAlt: record.displayTitle,
        displayRecord: record,
      },
    });
  }

  return records;
};

export const getMonthlyCookingRecordItems = (
  groups: CookingRecordListGroup[],
  monthKey: string
): MonthlyCookingRecordItem[] => {
  const items: MonthlyCookingRecordItem[] = [];

  for (const group of groups) {
    if (!group.date.startsWith(monthKey)) continue;
    for (const record of group.records) {
      items.push({ date: group.date, record });
    }
  }

  return items;
};

export const shouldFetchNextCookingRecordPage = (
  groups: CookingRecordListGroup[],
  selectedMonthKey: string,
  hasNextPage: boolean
): boolean => {
  if (!hasNextPage) return false;
  const loadedMonths = groups
    .map((group) => group.date.slice(0, 7))
    .filter((month) => MONTH_QUERY_PATTERN.test(month));
  if (loadedMonths.length === 0) return true;

  const oldestLoadedMonth = loadedMonths.reduce((oldest, month) =>
    month < oldest ? month : oldest
  );
  return oldestLoadedMonth >= selectedMonthKey;
};

const formatRecordDate = (date: string, locale: Locale): string => {
  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) return date;
  const pattern =
    locale === "en" ? "MMM d" : locale === "ja" ? "M月d日" : "M월 d일";
  return format(parsedDate, pattern, { locale: resolveDateFnsLocale(locale) });
};
