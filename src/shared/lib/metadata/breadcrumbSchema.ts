import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";
import { localizedPath, localizedSiteName } from "./localized";

const BREADCRUMB_RECIPES_LABEL: Record<Locale, string> = {
  ko: "레시피",
  en: "Recipes",
  ja: "レシピ",
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbListSchema = {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

const createBreadcrumbListElement = (
  items: BreadcrumbItem[]
): BreadcrumbListSchema => {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const createRecipeBreadcrumb = (
  recipeTitle: string,
  recipeId: string,
  locale: Locale = "ko"
) => {
  const items: BreadcrumbItem[] = [
    {
      name: localizedSiteName(locale),
      url: SEO_CONSTANTS.SITE_URL,
    },
    {
      name: BREADCRUMB_RECIPES_LABEL[locale],
      url: absoluteUrl(localizedPath(locale, "recipes")),
    },
    {
      name: recipeTitle,
      url: absoluteUrl(localizedPath(locale, `recipes/${recipeId}`)),
    },
  ];

  return createBreadcrumbListElement(items);
};

export const createCategoryBreadcrumb = (
  categoryName: string,
  categoryCode: string
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    {
      name: "홈",
      url: SEO_CONSTANTS.SITE_URL,
    },
    {
      name: `${categoryName} 레시피`,
      url: absoluteUrl(`recipes/category/${categoryCode}`),
    },
  ];

  return createBreadcrumbListElement(items);
};

export const createSearchBreadcrumb = (
  query: string,
  canonicalUrl?: string
): BreadcrumbListSchema => {
  const breadcrumbName = query ? `${query} 검색결과` : "검색결과";
  const breadcrumbUrl =
    canonicalUrl ||
    absoluteUrl(
      `search/results${query ? `?q=${encodeURIComponent(query)}` : ""}`
    );

  const items: BreadcrumbItem[] = [
    { name: "홈", url: SEO_CONSTANTS.SITE_URL },
    { name: "검색", url: absoluteUrl("search") },
    { name: breadcrumbName, url: breadcrumbUrl },
  ];

  return createBreadcrumbListElement(items);
};

export const createIngredientBreadcrumb = (
  ingredientName: string,
  ingredientId: string
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    { name: "홈", url: SEO_CONSTANTS.SITE_URL },
    { name: "재료", url: absoluteUrl("ingredients") },
    {
      name: ingredientName,
      url: absoluteUrl(`ingredients/${ingredientId}`),
    },
  ];

  return createBreadcrumbListElement(items);
};

export const createUserProfileBreadcrumb = (
  userName: string,
  userId: string
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    {
      name: "홈",
      url: SEO_CONSTANTS.SITE_URL,
    },
    {
      name: `${userName}님의 프로필`,
      url: absoluteUrl(`users/${userId}`),
    },
  ];

  return createBreadcrumbListElement(items);
};

export const createCurationBreadcrumb = (
  title: string,
  slug: string,
  categoryKoLabel?: string | null
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    { name: "홈", url: SEO_CONSTANTS.SITE_URL },
    { name: "큐레이션", url: absoluteUrl("curation") },
  ];
  if (categoryKoLabel) {
    items.push({
      name: `${categoryKoLabel} 큐레이션`,
      url: absoluteUrl("curation"),
    });
  }
  items.push({
    name: title,
    url: absoluteUrl(`curation/${slug}`),
  });
  return createBreadcrumbListElement(items);
};

export const createCurationListBreadcrumb = (
  categoryKoLabel?: string | null
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    { name: "홈", url: SEO_CONSTANTS.SITE_URL },
    { name: "큐레이션", url: absoluteUrl("curation") },
  ];
  if (categoryKoLabel) {
    items.push({
      name: `${categoryKoLabel} 큐레이션`,
      url: absoluteUrl("curation"),
    });
  }
  return createBreadcrumbListElement(items);
};
