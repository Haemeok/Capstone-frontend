import { SEO_CONSTANTS } from "./constants";
import { TagCode, TAGS_BY_CODE } from "@/shared/config/constants/recipe";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbListSchema = {
  "@context": "https://schema.org";
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
    "@context": "https://schema.org",
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
  tags?: string[]
): BreadcrumbListSchema => {
  const items: BreadcrumbItem[] = [
    {
      name: "홈",
      url: SEO_CONSTANTS.SITE_URL,
    },
  ];

  if (tags && tags.length > 0) {
    const firstTagCode = tags[0] as TagCode;
    const tagDef = TAGS_BY_CODE[firstTagCode];

    if (tagDef) {
      items.push({
        name: tagDef.name,
        url: `${SEO_CONSTANTS.SITE_URL}/recipes/category/${firstTagCode}`,
      });
    }
  }

  items.push({
    name: recipeTitle,
    url: `${SEO_CONSTANTS.SITE_URL}/recipes/${recipeId}`,
  });

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
