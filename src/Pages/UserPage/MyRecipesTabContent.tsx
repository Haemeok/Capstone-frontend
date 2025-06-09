import { BaseRecipesApiResponse, getMyRecipeItems } from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserStore } from '@/store/useUserStore';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getNextPageParam } from '@/utils/recipe';
type MyRecipesTabContentProps = {
  userId: number;
};

const MyRecipesTabContent = ({ userId }: MyRecipesTabContentProps) => {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');

  const { data, error, hasNextPage, isFetching, ref } = useInfiniteScroll<
    BaseRecipesApiResponse,
    Error,
    InfiniteData<BaseRecipesApiResponse>,
    [string, 'ASC' | 'DESC'],
    number
  >({
    queryKey: ['recipes', sort],
    queryFn: ({ pageParam }) =>
      getMyRecipeItems({
        userId,
        sort,
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <RecipeGrid
      recipes={recipes}
      isSimple={true}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
      noResults={recipes.length === 0 && !isFetching}
      noResultsMessage={
        recipes.length === 0
          ? '작성한 레시피가 없습니다.'
          : '레시피를 작성해보세요.'
      }
      observerRef={ref}
      error={error}
    />
  );
};

export default MyRecipesTabContent;
