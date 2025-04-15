import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
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

const CATEGORIES = [
  '전체',
  '가공/유제품',
  '고기',
  '곡물',
  '과일',
  '채소',
  '해산물',
];

const NewIngredientsPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
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
    IngredientsApiResponse, // TData: useInfiniteQuery가 반환하는 data 타입 (보통 TQueryFnData와 동일)
    [string, string, string], // TQueryKey
    number // TPageParam
  >({
    queryKey: ['ingredients', selectedCategory, searchQuery],
    queryFn: (
      { pageParam }, // queryFn에 새 API 함수 사용
    ) =>
      getIngredients({
        category: selectedCategory,
        search: searchQuery,
        pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage, // 응답 구조에 맞춤
    initialPageParam: 1,
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
    setBulkSelectedIds(new Set());
  };

  const handleModeChange = (newMode: 'single' | 'bulk') => {
    if (!newMode) return;
    setMode(newMode);
    setBulkSelectedIds(new Set());
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
  };

  return (
    <div className="flex h-screen flex-col pb-20">
      {/* 고정 헤더 영역 */}
      <div className="sticky top-0 z-10 bg-white pb-2 shadow-sm">
        {/* ... (상단 네비, 모드 토글, 검색창, 탭 메뉴) ... */}
        {/* 모드 토글 */}
        <div className="px-4 pb-3">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            className="grid grid-cols-2"
          >
            <ToggleGroupItem value="single" aria-label="Toggle single add">
              하나씩 추가
            </ToggleGroupItem>
            <ToggleGroupItem value="bulk" aria-label="Toggle bulk add">
              한번에 추가
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* 검색창 */}
        <div className="px-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 focus:border-[#00473c] focus:ring-1 focus:ring-[#00473c]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="scrollbar-hide mt-3 flex overflow-x-auto border-b border-gray-200">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
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
      </div>

      {/* 스크롤 가능 재료 목록 */}
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
            {data?.pages[0].items.length === 0 && !isFetching && (
              <p className="text-center text-gray-500">
                "{searchQuery}"에 해당하는 재료가 없습니다.
              </p>
            )}
            {/* allFetchedIngredients 타입이 IngredientItem[]으로 추론됨 */}
            {data?.pages[0].items.map((ingredient) => {
              const isAdded = false; // 임시 값
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
                  )}
                  onClick={
                    mode === 'bulk'
                      ? () => handleCheckboxChange(ingredient.id)
                      : undefined
                  }
                >
                  {/* ... (이미지, 이름 렌더링) ... */}
                  <div className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                    {ingredient.imageUrl && ( // IngredientItem 타입에 맞게 imageUrl 사용
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

                  {/* 모드별 버튼/체크박스 */}
                  {mode === 'single' ? (
                    <Button
                      size="sm"
                      variant={isAdded ? 'destructive' : 'default'}
                      className="rounded-full px-3"
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
            {!hasNextPage && data?.pages[0].items.length > 0 && (
              <p className="text-center text-sm text-gray-400">
                모든 재료를 불러왔습니다.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-200 bg-white p-4">
        {/* ... (모드별 버튼 렌더링) ... */}

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
    </div>
  );
};

export default NewIngredientsPage;
