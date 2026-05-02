import { SEO_CONSTANTS } from "./constants";

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
  recipeId: string
) => {
  const items: BreadcrumbItem[] = [
    {
      name: SEO_CONSTANTS.SITE_NAME,
      url: SEO_CONSTANTS.SITE_URL,
    },
    {
      name: "레시피",
      url: `${SEO_CONSTANTS.SITE_URL}/recipes`,
    },
    {
      name: recipeTitle,
      url: `${SEO_CONSTANTS.SITE_URL}/recipes/${recipeId}`,
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
      url: `${SEO_CONSTANTS.SITE_URL}/recipes/category/${categoryCode}`,
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
    `${SEO_CONSTANTS.SITE_URL}/search/results${query ? `?q=${encodeURIComponent(query)}` : ""}`;

  const items: BreadcrumbItem[] = [
    { name: "홈", url: SEO_CONSTANTS.SITE_URL },
    { name: "검색", url: `${SEO_CONSTANTS.SITE_URL}/search` },
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
    { name: "재료", url: `${SEO_CONSTANTS.SITE_URL}/ingredients` },
    {
      name: ingredientName,
      url: `${SEO_CONSTANTS.SITE_URL}/ingredients/${ingredientId}`,
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
      url: `${SEO_CONSTANTS.SITE_URL}/users/${userId}`,
    },
  ];

  return createBreadcrumbListElement(items);
};
