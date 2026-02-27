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
