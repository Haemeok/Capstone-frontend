import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MinusIcon, PlusIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib/utils';
import { getIngredients, type IngredientsApiResponse } from '@/api/ingredient'; // 새로 만든 API 함수 임포트
import {
  useAddIngredientBulkMutation,
  useAddIngredientMutation,
  useDeleteIngredientMutation,
} from '@/hooks/useIngredientMutation';
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe';
import PrevButton from '@/components/Button/PrevButton';

const NewIngredientsPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<number>>(
    new Set(),
  );

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
    // useInfiniteScroll 타입 파라미터 업데이트
    IngredientsApiResponse, // TQueryFnData: API 응답 타입
    Error, // TError
    InfiniteData<IngredientsApiResponse>, // TData: useInfiniteQuery가 반환하는 data 타입 (보통 TQueryFnData와 동일)
    [string, string, string, 'asc' | 'desc'], // TQueryKey
    number // TPageParam
  >({
    queryKey: ['ingredients', selectedCategory, searchQuery, sort],
    queryFn: (
      { pageParam }, // queryFn에 새 API 함수 사용
    ) =>
      getIngredients({
        category: selectedCategory === '전체' ? null : selectedCategory,
        search: searchQuery,
        pageParam,
        sort,
        isMine: false,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const { mutate: addIngredient } = useAddIngredientMutation();
  const { mutate: deleteIngredient } = useDeleteIngredientMutation();
  const { mutate: addIngredientBulk } = useAddIngredientBulkMutation();

  // --- 나머지 핸들러 함수들은 거의 동일하게 유지 ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleModeChange = (mode: 'single' | 'bulk') => {
    const newMode = mode === 'single' ? 'bulk' : 'single';
    setMode(newMode);
  };

  const handleCheckboxChange = (id: number) => {
    setBulkSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSingleAddRemove = (id: number, isAdded: boolean) => {
    if (isAdded) {
      deleteIngredient(id);
    } else {
      addIngredient(id);
    }
  };

  const handleBulkAdd = () => {
    addIngredientBulk(Array.from(bulkSelectedIds));
    setBulkSelectedIds(new Set());
  };

  return (
    <div className="flex h-screen flex-col bg-[#ffffff] pb-20">
      <div className="sticky top-0 z-10 pb-2 shadow-sm">
        <div className="flex justify-between p-4">
          <PrevButton />
          <h2 className="text-2xl font-bold">재료 추가</h2>
          <button
            className="flex items-center gap-1 rounded-full bg-gray-100 p-2"
            onClick={() => handleModeChange(mode)}
          >
            {mode === 'single' ? (
              <p className="text-sm">한개씩</p>
            ) : (
              <p className="text-sm">여러개</p>
            )}
          </button>
        </div>

        <div className="px-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="scrollbar-hide mt-3 flex overflow-x-auto px-2">
          {INGREDIENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                'flex-shrink-0 px-4 py-3',
                selectedCategory === category
                  ? 'text-olive font-bold'
                  : 'text-gray-400 hover:text-gray-700',
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {status === 'pending' ? (
          <p className="text-center text-gray-500">재료를 불러오는 중...</p>
        ) : status === 'error' ? (
          <p className="text-center text-red-500">
            오류 발생:{' '}
            {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        ) : (
          <div className="space-y-3">
            {data?.pages[0].content?.length === 0 && !isFetching && (
              <p className="text-center text-gray-500">
                "{searchQuery}"에 해당하는 재료가 없습니다.
              </p>
            )}

            {data?.pages
              .flatMap((page) => page.content)
              .map((ingredient) => {
                const isAdded = false;
                const isBulkSelected = bulkSelectedIds.has(ingredient.id);

                return (
                  <div
                    key={ingredient.id}
                    className={cn(
                      'flex items-center rounded-lg bg-white p-3 shadow-sm transition-colors',
                      mode === 'bulk' && 'cursor-pointer hover:bg-gray-50',
                      mode === 'bulk' &&
                        isBulkSelected &&
                        'border border-green-200 bg-green-50',
                      'font-noto-sans-kr',
                    )}
                    onClick={
                      mode === 'bulk'
                        ? () => handleCheckboxChange(ingredient.id)
                        : undefined
                    }
                  >
                    <div className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                      {ingredient.imageUrl && (
                        <img
                          src={ingredient.imageUrl}
                          alt={ingredient.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{ingredient.name}</p>
                    </div>

                    {mode === 'single' ? (
                      <Button
                        size="sm"
                        variant={isAdded ? 'destructive' : 'default'}
                        className="bg-beige text-brown rounded-full px-3 font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleAddRemove(ingredient.id, isAdded);
                        }}
                      >
                        {isAdded ? '삭제' : '추가'}
                      </Button>
                    ) : (
                      <Checkbox
                        id={`ingredient-${ingredient.id}`}
                        checked={isBulkSelected}
                        onCheckedChange={() =>
                          handleCheckboxChange(ingredient.id)
                        }
                        className="h-5 w-5 rounded border-gray-300 data-[state=checked]:border-[#5cc570] data-[state=checked]:bg-[#5cc570]"
                      />
                    )}
                  </div>
                );
              })}
            <div ref={ref} className="h-10" />
            {isFetchingNextPage && (
              <p className="text-center text-gray-500">
                더 많은 재료를 불러오는 중...
              </p>
            )}
            {!hasNextPage && data?.pages[0].content?.length && (
              <p className="text-center text-sm text-gray-400">
                모든 재료를 불러왔습니다.
              </p>
            )}
          </div>
        )}
      </div>

      {mode === 'bulk' && (
        <div className="fixed right-0 bottom-20 left-0 z-10 border-t border-gray-200 bg-white p-4">
          <Button
            onClick={handleBulkAdd}
            disabled={bulkSelectedIds.size === 0 || isFetching}
            className="w-full rounded-lg bg-[#5cc570] text-white shadow disabled:opacity-50"
          >
            {bulkSelectedIds.size > 0
              ? `${bulkSelectedIds.size}개 선택 완료`
              : '추가할 재료 선택'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewIngredientsPage;
