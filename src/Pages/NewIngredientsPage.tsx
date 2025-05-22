import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MinusIcon, PlusIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // 사용되지 않으므로 주석 처리 또는 삭제
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib/utils';
import { getIngredients, type IngredientsApiResponse } from '@/api/ingredient';
import {
  useAddIngredientBulkMutation,
  useAddIngredientMutation,
  useDeleteIngredientMutation,
} from '@/hooks/useIngredientMutation';
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe';
import PrevButton from '@/components/Button/PrevButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // ScrollTrigger import

const NewIngredientsPage = () => {
  // ... (useState, useInfiniteScroll 등 기존 상태 및 훅 설정은 거의 동일)
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
    ref: infiniteScrollTriggerRef,
  } = useInfiniteScroll<
    IngredientsApiResponse,
    Error,
    InfiniteData<IngredientsApiResponse>,
    [string, string, string, 'asc' | 'desc'],
    number
  >({
    queryKey: ['ingredients', selectedCategory, searchQuery, sort], // queryKey 그대로 사용
    queryFn: ({ pageParam }) =>
      getIngredients({
        category: selectedCategory === '전체' ? null : selectedCategory,
        search: searchQuery,
        pageParam,
        sort,
        isMine: false,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page.number === lastPage.page.totalPages - 1
        ? null
        : lastPage.page.number + 1,
    initialPageParam: 0,
  });

  const ingredientItems = data?.pages.flatMap((page) => page.content);

  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const itemsAnimateTargetRef = useRef<HTMLDivElement | null>(null);

  // 이미 애니메이션된 DOM 요소를 추적하기 위한 ref (Set 사용)
  const animatedItemsRef = useRef(new Set<Element>());

  // queryKey가 변경될 때 (필터, 검색어, 정렬 변경 시) 애니메이션 상태 초기화
  const queryKeyString = JSON.stringify([
    'ingredients',
    selectedCategory,
    searchQuery,
    sort,
  ]);

  console.log('queryKeyString', queryKeyString);

  useEffect(() => {
    animatedItemsRef.current.clear();
  }, [queryKeyString]);

  useEffect(() => {
    if (
      isFetching || // isFetchingNextPage가 아니라 isFetching을 봐야 초기 로드 및 필터 변경 시 대응
      !ingredientItems ||
      error ||
      status === 'pending' || // useInfiniteQuery의 status 활용
      !itemsAnimateTargetRef.current ||
      !scrollableContainerRef.current
    ) {
      return;
    }

    // GSAP 컨텍스트는 애니메이션들을 그룹화하고 한 번에 정리하는 데 사용됩니다.
    // 이 컨텍스트는 이 useEffect 스코프 내에서 생성된 애니메이션만 관리합니다.
    const ctx = gsap.context(() => {
      const currentDOMItems = Array.from(
        itemsAnimateTargetRef.current!.children,
      );
      let newTweenDelay = 0; // 새 아이템들에 대한 stagger 딜레이 카운터

      currentDOMItems.forEach((itemDOMElement: Element) => {
        // 아직 애니메이션되지 않은 아이템만 대상으로 애니메이션 적용
        if (!animatedItemsRef.current.has(itemDOMElement)) {
          gsap.set(itemDOMElement, { opacity: 0, y: 30, scale: 0.98 }); // 초기 상태 설정
          gsap.to(itemDOMElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: newTweenDelay, // 계산된 stagger 딜레이 적용
            ease: 'power2.out',
            scrollTrigger: {
              markers: true,
              trigger: itemDOMElement,
              scroller: scrollableContainerRef.current, // 실제 스크롤이 일어나는 요소
              start: 'top 95%', // 아이템 상단이 스크롤러 상단 95% 지점에 닿으면
              toggleActions: 'play none none none', // 한 번만 재생하고 상태 유지
              // once: true, // 위와 유사 (내부적으로 toggleActions를 설정함)
              onEnter: () => {
                // 스크롤 트리거가 발동될 때 (애니메이션 시작될 때)
                animatedItemsRef.current.add(itemDOMElement); // 애니메이션되었음을 표시
              },
            },
          });
        }
      });
    }, pageContainerRef); // 컨텍스트의 범위는 페이지 전체 컨테이너

    // 이 useEffect의 클린업 함수: 의존성 배열의 값이 변경되어 이 effect가 재실행될 때
    // 또는 컴포넌트가 언마운트될 때 호출됩니다.
    // 여기서 ctx.revert()를 호출하면, 이 effect 실행에서 생성된 애니메이션만 정리됩니다.
    // queryKeyString이 변경되어 animatedItemsRef가 초기화되면, 모든 아이템이 다시 "새로운" 아이템으로 간주되어 애니메이션됩니다.
    return () => ctx.revert();
  }, [
    ingredientItems,
    isFetching,
    error,
    status,
    scrollableContainerRef,
    itemsAnimateTargetRef,
    pageContainerRef,
    queryKeyString,
  ]);
  // queryKeyString을 의존성에 추가하여 필터/검색 변경 시 애니메이션이 올바르게 리셋되도록 함

  // --- 나머지 핸들러 함수 및 JSX는 이전과 거의 동일하게 유지 ---
  // ... (handleSearchChange, handleCategoryClick 등 핸들러 함수들) ...
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleModeChange = (currentMode: 'single' | 'bulk') => {
    setMode(currentMode === 'single' ? 'bulk' : 'single');
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
  const { mutate: addIngredient } = useAddIngredientMutation([
    'ingredients',
    selectedCategory,
    searchQuery,
    sort,
  ]);
  const { mutate: deleteIngredient } = useDeleteIngredientMutation();
  const { mutate: addIngredientBulk } = useAddIngredientBulkMutation();

  const handleSingleAddRemove = (id: number, isAdded: boolean) => {
    if (isAdded) {
      deleteIngredient(id);
    } else {
      addIngredient(id, {
        // onSuccess, onError 콜백도 여기서 개별적으로 추가하여 테스트 가능
        onSuccess: () => {
          console.log(
            '[NewIngredientsPage] addIngredient mutation onSuccess for ID:',
            id,
          );
        },
        onError: (error) => {
          console.error(
            '[NewIngredientsPage] addIngredient mutation onError for ID:',
            id,
            error,
          );
        },
      });
    }
  };

  const handleBulkAdd = () => {
    addIngredientBulk(Array.from(bulkSelectedIds));
    setBulkSelectedIds(new Set());
  };

  return (
    <div
      ref={pageContainerRef}
      className="flex h-screen flex-col bg-[#ffffff] pb-20"
    >
      {/* 헤더 영역 (이전과 동일) */}
      <div className="sticky top-0 z-10 bg-white pb-2 shadow-sm">
        <div className="flex justify-between p-4">
          <PrevButton />
          <h2 className="text-2xl font-bold">재료 추가</h2>
          <button
            className="flex items-center gap-1 rounded-full bg-gray-100 p-2 px-3"
            onClick={() => handleModeChange(mode)}
          >
            <p className="text-sm">{mode === 'single' ? '한개씩' : '여러개'}</p>
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
              className="focus:border-olive focus:ring-olive w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
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
                'flex-shrink-0 px-4 py-3 text-sm',
                selectedCategory === category
                  ? 'text-olive font-bold'
                  : 'text-gray-500 hover:text-gray-800',
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 재료 목록 (스크롤 및 애니메이션 영역) */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollableContainerRef}>
        {status === 'pending' &&
        (!ingredientItems || ingredientItems.length === 0) ? (
          <p className="pt-10 text-center text-gray-500">
            재료를 불러오는 중...
          </p>
        ) : status === 'error' ? (
          <p className="pt-10 text-center text-red-500">
            오류 발생:{' '}
            {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        ) : (
          <div className="space-y-3" ref={itemsAnimateTargetRef}>
            {ingredientItems?.length === 0 && !isFetching && (
              <p className="pt-10 text-center text-gray-500">
                "
                {searchQuery ||
                  (selectedCategory !== '전체'
                    ? selectedCategory
                    : '모든 카테고리')}
                "에 해당하는 재료가 없습니다.
              </p>
            )}
            {ingredientItems?.map((ingredient) => {
              const isAdded = ingredient.inFridge;
              const isBulkSelected = bulkSelectedIds.has(ingredient.id);

              return (
                <div
                  key={ingredient.id} // React는 key를 통해 DOM 요소를 식별하고 재사용합니다.
                  className={cn(
                    'flex items-center rounded-lg bg-white p-3 shadow-sm transition-colors',
                    mode === 'bulk' && 'cursor-pointer hover:bg-gray-50',
                    mode === 'bulk' &&
                      isBulkSelected &&
                      'border-2 border-green-400 bg-green-50 shadow-md',
                    'font-noto-sans-kr',
                  )}
                  onClick={
                    mode === 'bulk'
                      ? () => handleCheckboxChange(ingredient.id)
                      : undefined
                  }
                >
                  {/* ... 개별 아이템 내부 구조 (이전과 동일) ... */}
                  <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {ingredient.imageUrl ? (
                      <img
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {ingredient.name}
                    </p>
                  </div>

                  {mode === 'single' ? (
                    <Button
                      size="sm"
                      variant={isAdded ? 'outline' : 'default'}
                      className={cn(
                        'rounded-full px-3 text-xs font-bold',
                        isAdded
                          ? 'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600'
                          : 'bg-olive hover:bg-olive-dark text-white',
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSingleAddRemove(ingredient.id, isAdded);
                      }}
                    >
                      {isAdded ? '빼기' : '추가'}
                    </Button>
                  ) : (
                    <Checkbox
                      id={`ingredient-${ingredient.id}`}
                      checked={isBulkSelected}
                      onCheckedChange={() =>
                        handleCheckboxChange(ingredient.id)
                      }
                      className="h-5 w-5 rounded border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                    />
                  )}
                </div>
              );
            })}
            <div ref={infiniteScrollTriggerRef} className="h-10" />{' '}
            {/* 무한 스크롤 감지 요소 */}
            {isFetchingNextPage && (
              <p className="py-3 text-center text-sm text-gray-500">
                더 많은 재료를 불러오는 중...
              </p>
            )}
            {!isFetchingNextPage &&
              !hasNextPage &&
              ingredientItems &&
              ingredientItems.length > 0 && (
                <p className="py-3 text-center text-sm text-gray-400">
                  모든 재료를 불러왔습니다.
                </p>
              )}
          </div>
        )}
      </div>

      {/* 여러개 선택 모드 시 하단 버튼 (이전과 동일) */}
      {mode === 'bulk' && (
        <div className="shadow-top-md fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white p-4">
          <Button
            onClick={handleBulkAdd}
            disabled={bulkSelectedIds.size === 0 || isFetching}
            className="w-full rounded-lg bg-green-500 py-3 text-base font-semibold text-white shadow hover:bg-green-600 disabled:bg-gray-300 disabled:opacity-70"
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
