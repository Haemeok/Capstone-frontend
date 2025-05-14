// src/components/RecipeGrid.tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from '@/type/recipe';

import Circle from '../Icon/Circle';
import SimpleRecipeGridItem from './SimpleRecipeGridItem';
import DetailedRecipeGridItem from './DetailedRecipeGridItem';

// GSAP ScrollTrigger 플러그인 등록
if (typeof window !== 'undefined') {
  // 서버사이드 렌더링 환경 고려
  gsap.registerPlugin(ScrollTrigger);
}

type RecipeGridProps = {
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[];
  isSimple?: boolean;
  height?: number;
  hasNextPage?: boolean;
  isFetching?: boolean;
  observerRef?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
  error?: Error | null;
};

const RecipeGrid = ({
  recipes,
  isSimple = false,
  height = 64,
  hasNextPage,
  isFetching, // 다음 페이지 로딩 중 여부 (초기 로딩이 아님)
  observerRef,
  noResults,
  noResultsMessage = '표시할 레시피가 없습니다.',
  lastPageMessage = '모든 레시피를 다 봤어요!',
  error,
}: RecipeGridProps) => {
  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null); // GSAP 컨텍스트 범위
  const gridAnimateTargetRef = useRef<HTMLDivElement | null>(null); // 실제 그리드 아이템들을 감싸는 div

  useEffect(() => {
    if (!recipes || recipes.length === 0 || error || noResults) {
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
  }, [recipes, error, noResults]);

  // 초기 로딩 중 (recipes 배열이 비어있거나, isFetching이 true인데 recipes가 없는 경우)
  if (isFetching && (!recipes || recipes.length === 0)) {
    return (
      <div className="flex h-[400px] flex-1 items-center justify-center py-10">
        <Circle className="text-olive-light h-15 w-15" />
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <p className="py-10 text-center text-base text-red-500">
        {error.message || '오류가 발생했습니다. 다시 시도해주세요.'}
      </p>
    );
  }

  // 결과 없음 (noResults가 true이거나, recipes가 비어있는데 로딩/에러도 아닐 때)
  if (noResults || !recipes || recipes.length === 0) {
    return (
      <p className="py-10 text-center text-base text-gray-500">
        {noResultsMessage}
      </p>
    );
  }

  return (
    <div ref={gridItemsContainerRef} className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 pb-6">
        <div
          ref={gridAnimateTargetRef}
          className="grid grid-cols-2 gap-4 gap-y-6"
        >
          {recipes.map((recipe) =>
            isSimple ? (
              <SimpleRecipeGridItem
                key={recipe.id} // key는 필수
                recipe={recipe as BaseRecipeGridItem}
                height={height}
                // data-gsap-animated 속성은 GSAP이 관리하므로 직접 설정할 필요 없음
              />
            ) : (
              <DetailedRecipeGridItem
                key={recipe.id} // key는 필수
                recipe={recipe as DetailedRecipeGridItemType}
                height={height}
              />
            ),
          )}
        </div>
      </div>

      {isFetching && recipes && recipes.length > 0 && (
        <div className="flex items-center justify-center py-5">
          <Circle className="text-olive-light h-10 w-10" />
        </div>
      )}

      <div ref={observerRef} className="h-10 text-center">
        {!isFetching &&
          !hasNextPage &&
          recipes &&
          recipes.length > 0 &&
          !error &&
          !noResults && (
            <p className="text-sm text-gray-500">{lastPageMessage}</p>
          )}
      </div>
    </div>
  );
};

export default RecipeGrid;
