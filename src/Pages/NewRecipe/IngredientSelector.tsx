import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getIngredients, IngredientsApiResponse } from '@/api/ingredient';
import { IngredientItem, IngredientPayload } from '@/type/recipe'; // Payload 타입 사용
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe'; // 카테고리 상수 임포트
import { cn } from '@/lib/utils';
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  Drawer,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';

type IngredientSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientSelect: (ingredient: IngredientPayload) => void; // 선택된 재료 정보 전달 콜백
};

const IngredientSelector = ({
  open,
  onOpenChange,
  onIngredientSelect,
}: IngredientSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // NewIngredientsPage와 유사하게 useInfiniteScroll 설정
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    ref, // 무한 스크롤 트리거 ref
  } = useInfiniteScroll<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    [string, string, string], // QueryKey 타입 (category, search, sort-기본값)
    number
  >({
    queryKey: ['drawerIngredients', selectedCategory, searchQuery], // 고유한 queryKey 사용
    queryFn: (
      { pageParam = 0 }, // 초기 pageParam 설정
    ) =>
      getIngredients({
        category: selectedCategory === '전체' ? null : selectedCategory,
        search: searchQuery,
        pageParam,
        sort: 'name,asc', // 이름 오름차순 기본 정렬
        isMine: false, // 내 재료 여부 필터링 안 함 (필요시 변경)
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // "추가" 버튼 클릭 시 호출될 함수
  const handleAddClick = (ingredient: IngredientPayload) => {
    onIngredientSelect(ingredient); // 부모 컴포넌트로 선택된 재료 정보 전달
    // onOpenChange(false); // Drawer 닫기 (필요에 따라 조절)
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex w-full flex-col sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="text-xl">재료 검색 및 추가</DrawerTitle>
          <DrawerDescription className="text-md">
            레시피에 사용할 재료를 검색하고 추가하세요.
          </DrawerDescription>
        </DrawerHeader>

        <div className="sticky top-0 z-10 bg-white">
          <div className="relative px-4">
            <Search
              size={18}
              className="absolute top-1/2 left-7 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="재료 이름을 검색하세요"
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="scrollbar-hide mt-3 flex overflow-x-auto px-2">
            {INGREDIENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  'flex-shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors', // 스타일 조정
                  selectedCategory === category
                    ? 'bg-green-600 font-medium text-white' // 활성 스타일
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800', // 비활성 스타일
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* 재료 목록 */}
        <div className="flex h-120 flex-shrink-0 flex-col justify-center overflow-y-auto p-4">
          {status === 'pending' ? (
            <p className="text-center text-gray-500">재료 로딩 중...</p>
          ) : status === 'error' ? (
            <p className="text-center text-red-500">
              오류 발생:{' '}
              {error instanceof Error ? error.message : '알 수 없는 오류'}
            </p>
          ) : (
            <div className="h-full space-y-2">
              {data?.pages
                .flatMap((page) => page.content)
                .map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
                      {/* 필요시 다른 정보 표시 (예: 카테고리) */}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" // 스타일 조정
                      onClick={() => handleAddClick(ingredient)} // API 응답 타입 확인 필요
                    >
                      추가
                    </Button>
                  </div>
                ))}
              <div ref={ref} className="h-10 text-center">
                {!hasNextPage && data?.pages[0]?.content?.length && (
                  <p className="text-sm text-gray-400">
                    모든 재료를 불러왔습니다.
                  </p>
                )}
              </div>
              {data?.pages[0]?.content?.length === 0 && !isFetching && (
                <p className="py-10 text-center text-gray-500">
                  "{searchQuery || selectedCategory}"에 해당하는 재료가
                  없습니다.
                </p>
              )}
            </div>
          )}
        </div>
        <DrawerFooter className="mt-auto p-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientSelector;
