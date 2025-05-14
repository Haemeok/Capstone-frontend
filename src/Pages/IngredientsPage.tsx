import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import IngredientItem from '@/components/ingredient/IngredientItem';
import { useNavigate } from 'react-router';
import { getIngredients } from '@/api/ingredient';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { IngredientsApiResponse } from '@/api/ingredient';
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import gsap from 'gsap';

const IngredientsPage = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const { user } = useUserStore();
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

  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null); // GSAP 컨텍스트 범위
  const gridAnimateTargetRef = useRef<HTMLDivElement | null>(null); // 실제 그리드 아이템들을 감싸는 div

  useEffect(() => {
    if (!ingredients || ingredients.length === 0 || error) {
      return;
    }

    // GSAP Context를 사용하여 애니메이션과 ScrollTrigger를 안전하게 관리
    const ctx = gsap.context(() => {
      if (gridAnimateTargetRef.current) {
        // 1. 아직 애니메이션이 적용되지 않은 아이템들만 선택
        //    ':scope > *'는 gridAnimateTargetRef의 직계 자식 요소를 의미.
        const newItems = Array.from(
          gridAnimateTargetRef.current.querySelectorAll<HTMLElement>(
            ':scope > *:not([data-gsap-animated="true"])',
          ),
        );

        if (newItems.length > 0) {
          // 2. 새로 추가된 아이템들에 대해서만 애니메이션 적용
          gsap.fromTo(
            newItems, // 타겟: 새로 추가된 아이템들
            { opacity: 0, y: 30, scale: 0.98 }, // 시작 상태
            {
              // 종료 상태
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: {
                each: 0.08,

                onStart: function () {},
              },
              ease: 'power2.out',
              // ScrollTrigger는 gridAnimateTargetRef(그리드 컨테이너)가 보일 때 발동
              scrollTrigger: {
                trigger: gridAnimateTargetRef.current,
                start: 'top 85%',
                // markers: process.env.NODE_ENV === 'development',
                toggleActions: 'play none none none', // 컨테이너가 보일 때 한 번만 재생
                // (새로운 아이템들에 대한 이 애니메이션 인스턴스가 한 번만 재생)
                // once: true, // ScrollTrigger 3.11+ 에서 사용 가능. ScrollTrigger 자체가 한 번만 발동.
                // 이 경우, 새 아이템이 추가될 때마다 새 ScrollTrigger가 생성되므로,
                // 각 ScrollTrigger 인스턴스는 한 번만 발동하게 됨.
              },
              // 애니메이션(들)이 완료된 후 실행
              onComplete: () => {
                newItems.forEach((item) => {
                  item.setAttribute('data-gsap-animated', 'true');
                });
              },
            },
          );
        }
      }
    }, gridItemsContainerRef); // 컨텍스트 범위 지정

    // 클린업 함수: 컴포넌트 언마운트 또는 의존성 변경으로 재실행 전 호출
    return () => ctx.revert();
  }, [ingredients, error]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7f7] p-4">
        <h1 className="text-2xl font-bold">{user?.nickname}님의 냉장고</h1>
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
                ? 'text-olive-light'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex grow flex-col gap-4" ref={gridItemsContainerRef}>
        <div
          ref={gridAnimateTargetRef}
          className="grid w-full grid-cols-2 gap-4 p-4"
        >
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
        {!hasNextPage && ingredients && ingredients.length === 0 && (
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
    </div>
  );
};

export default IngredientsPage;
