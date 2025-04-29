import { getRecipeItems, RecipesApiResponse } from '@/api/recipe';
import RecipeGrid from '@/components/RecipeGrid';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { InfiniteData } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [dishType, setDishType] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[] | null>(null);
  const [search, setSearch] = useState<string>();

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
    RecipesApiResponse,
    Error,
    InfiniteData<RecipesApiResponse>,
    [string, string, 'asc' | 'desc'],
    number
  >({
    queryKey: ['recipes', selectedCategory, sort],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort,
        dishType,
        tagNames,
        search,
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  const noResults = recipes.length === 0 && !isFetching;
  const noResultsMessage =
    search && recipes.length === 0
      ? `"${search}"에 해당하는 레시피가 없습니다.`
      : `"${selectedCategory}"에 해당하는 레시피가 없습니다.`;

  return (
    <div className="container mx-auto p-2">
      <h1 className="mb-4 text-2xl font-bold">Recipes</h1>

      <RecipeGrid
        recipes={recipes}
        hasNextPage={hasNextPage}
        ref={ref}
        noResults={noResults}
        noResultsMessage={noResultsMessage}
      />
    </div>
  );
};

export default RecipesPage;
