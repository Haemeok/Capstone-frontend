import { BaseRecipesApiResponse, getMyFavoriteItems } from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import { getNextPageParam } from '@/utils/recipe';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const MyFavoriteRecipesTabContent = () => {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');

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
    [string, string, 'ASC' | 'DESC'],
    number
  >({
    queryKey: ['recipes', 'favorite', sort],
    queryFn: ({ pageParam }) =>
      getMyFavoriteItems({
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
      isSimple={false}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
      noResults={recipes.length === 0 && !isFetching}
      noResultsMessage={
        recipes.length === 0
          ? '즐겨찾기한 레시피가 없습니다.'
          : '즐겨찾기한 레시피를 추가해보세요.'
      }
      observerRef={ref}
      error={error}
    />
  );
};

export default MyFavoriteRecipesTabContent;
