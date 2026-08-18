import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import { fetchRecipeCookingReviewsOnServer } from "@/entities/cooking-review/model/api.server";
import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review/model/queryKeys";
import { isPrivateRecipe } from "@/entities/recipe/lib/visibility";
import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";

import { RecipeReviewsPageClient } from "./_components/RecipeReviewsPageClient";

export const REVIEW_PAGE_SIZE = 20;

export const renderRecipeReviewsPage = async ({
  recipeId,
}: {
  recipeId: string;
}) => {
  const recipe = await getStaticrecipionServer(recipeId);

  if (!recipe || isPrivateRecipe(recipe)) {
    notFound();
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const queryKey = COOKING_REVIEW_QUERY_KEYS.publicList(
    recipeId,
    false,
    REVIEW_PAGE_SIZE
  );

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchRecipeCookingReviewsOnServer({
        recipeId,
        page: pageParam,
        size: REVIEW_PAGE_SIZE,
        photoOnly: false,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext ? pages.length : undefined,
    pages: 1,
  });

  return (
    <DictionaryProvider dict={getDictionary("ko")}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecipeReviewsPageClient
          recipeId={recipeId}
          recipeTitle={recipe.title}
          recipeImageUrl={recipe.imageUrl}
          saveAmount={recipe.marketPrice - recipe.totalIngredientCost}
        />
      </HydrationBoundary>
    </DictionaryProvider>
  );
};
