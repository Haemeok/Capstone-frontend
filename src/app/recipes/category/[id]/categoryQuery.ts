import { SORT_CONFIGS } from "@/shared/config/constants/recipe";
import type { Locale } from "@/shared/i18n";

import type {
  RecipeItemsQueryParams,
  RecipeQueryParams,
} from "@/entities/recipe/model/types";

export const CATEGORY_PAGE_SIZE = 20;

const latestSort = SORT_CONFIGS.recipe.최신순;

export const CATEGORY_DEFAULT_SORT = `${latestSort.field},${latestSort.direction.toLowerCase()}`;

const CATEGORY_RECIPE_TYPES = ["USER", "AI", "YOUTUBE"] as const;

type CategoryQueryContext = {
  tagCode: string;
  sort: string;
  locale: Locale;
  initialApiPage: number;
};

export const buildCategoryQueryKey = ({
  tagCode,
  sort,
  locale,
  initialApiPage,
}: CategoryQueryContext) =>
  [
    "recipes",
    "category",
    tagCode,
    sort,
    locale,
    CATEGORY_RECIPE_TYPES.join(","),
    CATEGORY_PAGE_SIZE,
    initialApiPage,
  ] as const;

const buildCommonParams = (tagCode: string, sort: string, locale: Locale) => ({
  tags: [tagCode],
  sort,
  size: CATEGORY_PAGE_SIZE,
  types: [...CATEGORY_RECIPE_TYPES],
  ...(locale === "ko" ? {} : { lang: locale }),
});

export const buildCategoryServerQuery = (
  context: CategoryQueryContext,
  apiPage: number
): RecipeItemsQueryParams => ({
  key: "search",
  page: apiPage,
  ...buildCommonParams(context.tagCode, context.sort, context.locale),
});

export const buildCategoryClientQuery = (
  context: CategoryQueryContext,
  pageParam: number
): RecipeQueryParams => ({
  pageParam,
  ...buildCommonParams(context.tagCode, context.sort, context.locale),
});
