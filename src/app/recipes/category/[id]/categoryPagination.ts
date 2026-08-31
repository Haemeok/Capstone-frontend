import type { TagCode } from "@/shared/config/constants/recipe";
import type { Locale } from "@/shared/i18n";

export type CategorySearchParams = {
  page?: string | string[];
};

export type CategoryPage = {
  publicPage: number;
  apiPage: number;
};

const POSITIVE_INTEGER = /^[1-9]\d*$/;

export const parseCategoryPage = (
  value: string | string[] | undefined
): CategoryPage => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !POSITIVE_INTEGER.test(raw)) {
    return { publicPage: 1, apiPage: 0 };
  }

  const publicPage = Number(raw);
  if (!Number.isSafeInteger(publicPage)) {
    return { publicPage: 1, apiPage: 0 };
  }

  return { publicPage, apiPage: publicPage - 1 };
};

export const buildCategoryPageHref = ({
  tagCode,
  locale,
  publicPage,
}: {
  tagCode: TagCode;
  locale: Locale;
  publicPage: number;
}): string => {
  const localePrefix = locale === "ko" ? "" : `/${locale}`;
  const basePath = `${localePrefix}/recipes/category/${tagCode}`;
  if (publicPage === 1) return basePath;

  const query = new URLSearchParams({ page: String(publicPage) });
  return `${basePath}?${query}`;
};
