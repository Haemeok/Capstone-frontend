import { RecipeQueryParams } from "@/entities/recipe";

import { CATEGORY_BASE_URL } from "./recipe";

export type ContentPageSearchParams = Pick<
  RecipeQueryParams,
  | "q"
  | "dishType"
  | "tags"
  | "ingredientIds"
  | "minCost"
  | "maxCost"
  | "minCalories"
  | "maxCalories"
  | "minCarb"
  | "maxCarb"
  | "minProtein"
  | "maxProtein"
  | "minFat"
  | "maxFat"
  | "types"
>;

export type ContentPageId =
  | "diet-healthy"
  | "ai-creative"
  | "chef-secret"
  | "solo-drink"
  | "budget-gourmet"
  | "late-night-guilty"
  | "youtube-mukbang"
  | "hangover-soup"
  | "air-fryer-legend"
  | "kids-snack"
  | "home-party-flex"
  | "protein-bulk";

export type ContentPage = {
  id: ContentPageId;
  imageUrl: string;
  searchParams: ContentPageSearchParams;
};

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: "diet-healthy",
    imageUrl: `${CATEGORY_BASE_URL}healthy.webp`,
    searchParams: { tags: ["HEALTHY"], maxCalories: 400, minProtein: 15 },
  },
  {
    id: "ai-creative",
    imageUrl: `${CATEGORY_BASE_URL}quick.webp`,
    searchParams: { types: ["AI"] },
  },
  {
    id: "chef-secret",
    imageUrl: `${CATEGORY_BASE_URL}chef.webp`,
    searchParams: { tags: ["CHEF_RECIPE"], types: ["YOUTUBE"] },
  },
  {
    id: "solo-drink",
    imageUrl: `${CATEGORY_BASE_URL}drink.webp`,
    searchParams: { tags: ["SOLO", "DRINK", "QUICK"] },
  },

  {
    id: "budget-gourmet",
    imageUrl: `${CATEGORY_BASE_URL}solo.webp`,
    searchParams: { maxCost: 5000 },
  },
  {
    id: "late-night-guilty",
    imageUrl: `${CATEGORY_BASE_URL}late_night.webp`,
    searchParams: { tags: ["LATE_NIGHT"], maxCalories: 500 },
  },

  {
    id: "youtube-mukbang",
    imageUrl: `${CATEGORY_BASE_URL}holiday.webp`,
    searchParams: { tags: ["LATE_NIGHT"], types: ["YOUTUBE"] },
  },
  {
    id: "hangover-soup",
    imageUrl: `${CATEGORY_BASE_URL}hangover.webp`,
    searchParams: { tags: ["HANGOVER"], dishType: "SOUP_STEW" },
  },

  {
    id: "air-fryer-legend",
    imageUrl: `${CATEGORY_BASE_URL}air_fryer.webp`,
    searchParams: { tags: ["AIR_FRYER"], types: ["YOUTUBE"] },
  },
  {
    id: "kids-snack",
    imageUrl: `${CATEGORY_BASE_URL}kids.webp`,
    searchParams: { tags: ["KIDS"] },
  },
  {
    id: "home-party-flex",
    imageUrl: `${CATEGORY_BASE_URL}home_party.webp`,
    searchParams: { tags: ["HOME_PARTY"] },
  },
  {
    id: "protein-bulk",
    imageUrl: `${CATEGORY_BASE_URL}camping.webp`,
    searchParams: { minProtein: 30 },
  },
];

export const PRICE_RANGES = [
  {
    id: "under-5000",
    label: "5천원 이하",
    description: "가성비 최고",
    maxCost: 5000,
    imageUrl: `${CATEGORY_BASE_URL}solo.webp`,
  },
  {
    id: "under-10000",
    label: "1만원 이하",
    description: "합리적인 가격",
    maxCost: 10000,
    imageUrl: `${CATEGORY_BASE_URL}air_fryer.webp`,
  },
  {
    id: "under-20000",
    label: "2만원 이하",
    description: "든든한 한끼",
    maxCost: 20000,
    imageUrl: `${CATEGORY_BASE_URL}home_party.webp`,
  },
  {
    id: "premium",
    label: "프리미엄",
    description: "특별한 날",
    minCost: 20000,
    imageUrl: `${CATEGORY_BASE_URL}healthy.webp`,
  },
];
