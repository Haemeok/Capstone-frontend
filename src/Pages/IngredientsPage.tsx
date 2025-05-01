import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import IngredientItem from '@/components/ingredient/IngredientItem';
import { useNavigate } from 'react-router';
import { getIngredients } from '@/api/ingredient';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { IngredientsApiResponse } from '@/api/ingredient';
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe';
import { cn } from '@/lib/utils';

const IngredientsPage = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

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
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    [string, string, 'asc' | 'desc'],
    number
  >({
    queryKey: ['ingredients', selectedCategory, sort],
    queryFn: ({ pageParam }) =>
      getIngredients({
        category: selectedCategory === '전체' ? null : selectedCategory,
        pageParam,
        sort,
        isMine: true,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const ingredients = data?.pages.flatMap((page) => page.content);
  console.log(ingredients);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7f7] p-4">
        <h1 className="text-2xl font-bold">도원진님의 냉장고</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
          >
            {isDeleteMode ? '완료' : '재료 삭제'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/ingredients/new')}
          >
            재료 추가
          </Button>
        </div>
      </div>
      <div className="scrollbar-hide flex overflow-x-auto border-b border-gray-200">
        {INGREDIENT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'flex-shrink-0 px-4 py-3 text-sm font-medium',
              selectedCategory === category
                ? 'border-b-2 border-[#5cc570] text-[#5cc570]'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-4 p-4">
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            isDeleteMode={isDeleteMode}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <p className="text-center text-gray-500">
          더 많은 재료를 불러오는 중...
        </p>
      )}
      {!hasNextPage && ingredients?.length && (
        <p className="text-center text-sm text-gray-400">
          모든 재료를 불러왔습니다.
        </p>
      )}
      {error && (
        <p className="text-center text-red-500">
          오류 발생:{' '}
          {error instanceof Error ? error.message : '알 수 없는 오류'}
        </p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default IngredientsPage;
