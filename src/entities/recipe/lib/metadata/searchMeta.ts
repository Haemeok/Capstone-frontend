import type { Locale } from "@/shared/i18n";
import { format, getDictionary, plural } from "@/shared/i18n";

export const buildSearchTitle = (
  q: string,
  totalElements: number,
  page: number,
  locale: Locale
): string => {
  const d = getDictionary(locale).meta.search;
  const pageLabel = page > 0 ? format(d.pageSuffix, { page: page + 1 }) : "";
  if (!q) return format(d.titleNoQuery, { page: pageLabel });
  const qText =
    d.queryNoun && !q.includes(d.queryNoun) ? `${q} ${d.queryNoun}` : q;
  return format(plural(totalElements, d.titleWithQuery), {
    q: qText,
    count: totalElements,
    page: pageLabel,
  });
};

export const buildSearchDescription = (
  q: string,
  totalElements: number,
  locale: Locale
): string => {
  const d = getDictionary(locale).meta.search;
  if (!q) return d.descNoQuery;
  const qText =
    d.queryNoun && !q.includes(d.queryNoun) ? `${q} ${d.queryNoun}` : q;
  return format(plural(totalElements, d.descWithQuery), {
    q: qText,
    count: totalElements,
  });
};
