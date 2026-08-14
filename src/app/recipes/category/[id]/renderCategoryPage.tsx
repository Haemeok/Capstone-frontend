import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import type { TagCode } from "@/shared/config/constants/recipe";
import type { Locale } from "@/shared/i18n";
import { getNextSlicePageParam } from "@/shared/lib/utils";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

import CategoryDetailClient from "./CategoryDetailClient";
import {
  type CategorySearchParams,
  parseCategoryPage,
} from "./categoryPagination";
import {
  buildCategoryQueryKey,
  buildCategoryServerQuery,
  CATEGORY_DEFAULT_SORT,
} from "./categoryQuery";

type RenderCategoryPageArgs = {
  tagCode: TagCode;
  searchParams: CategorySearchParams;
  locale: Locale;
};

export const renderCategoryPage = async ({
  tagCode,
  searchParams,
  locale,
}: RenderCategoryPageArgs) => {
  const { apiPage: initialApiPage } = parseCategoryPage(searchParams.page);
  const context = {
    tagCode,
    sort: CATEGORY_DEFAULT_SORT,
    locale,
    initialApiPage,
  };
  const queryKey = buildCategoryQueryKey(context);
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getRecipesOnServer(buildCategoryServerQuery(context, pageParam)),
    initialPageParam: initialApiPage,
    getNextPageParam: getNextSlicePageParam,
    pages: 1,
  });

  return (
    <Suspense fallback={<RecipeGridSkeleton count={6} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryDetailClient
          tagCode={tagCode}
          locale={locale}
          initialApiPage={initialApiPage}
        />
      </HydrationBoundary>
    </Suspense>
  );
};
