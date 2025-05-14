import { getRecipeItems, DetailedRecipesApiResponse } from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { InfiniteData } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [dishType, setDishType] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[] | null>(null);
  const [q, setSearch] = useState<string>();

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
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string, 'asc' | 'desc'],
    number
  >({
    queryKey: ['recipes', selectedCategory, sort],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort,
        dishType,
        tagNames,
        q,
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  const noResults = recipes.length === 0 && !isFetching;
  const noResultsMessage =
    q && recipes.length === 0
      ? `"${q}"에 해당하는 레시피가 없습니다.`
      : `"${selectedCategory}"에 해당하는 레시피가 없습니다.`;

  return (
    <div className="container mx-auto p-2">
      <h1 className="mb-4 text-2xl font-bold">Recipes</h1>

      <RecipeGrid
        recipes={recipes}
        isSimple={false}
        hasNextPage={hasNextPage}
        observerRef={ref}
        noResults={noResults}
        noResultsMessage={noResultsMessage}
      />
    </div>
  );
};

export default RecipesPage;
