import { BaseRecipesApiResponse, getMyRecipeItems } from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserStore } from '@/store/useUserStore';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

type MyRecipesTabContentProps = {
  userId: number;
};

const MyRecipesTabContent = ({ userId }: MyRecipesTabContentProps) => {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('ASC');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    ref,
  } = useInfiniteScroll<
    BaseRecipesApiResponse,
    Error,
    InfiniteData<BaseRecipesApiResponse>,
    [string, 'ASC' | 'DESC'],
    number
  >({
    queryKey: ['my-recipes', sort],
    queryFn: ({ pageParam }) =>
      getMyRecipeItems({
        userId,
        sort,
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
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
      ref={ref}
      error={error}
    />
  );
};

export default MyRecipesTabContent;
