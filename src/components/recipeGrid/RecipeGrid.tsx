import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from '@/type/recipe';

import Circle from '../Icon/Circle';
import SimpleRecipeGridItem from './SimpleRecipeGridItem';
import DetailedRecipeGridItem from './DetailedRecipeGridItem';
import { Drawer, DrawerContent } from '../ui/drawer';
import { Pencil, Trash } from 'lucide-react';
import useDeleteRecipeMutation from '@/hooks/useDeleteRecipeMutation';
import { DeleteModal } from '../DeleteModal';
import { useNavigate } from 'react-router';

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
  queryKeyString?: string;
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
  queryKeyString,
}: RecipeGridProps) => {
  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null); // GSAP 컨텍스트 범위
  const itemsAnimateTargetRef = useRef<HTMLDivElement | null>(null);
  const animatedItemsRef = useRef(new Set<Element>());

  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleOpenDrawer = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsDrawerOpen(true);
  };
  const handleDrawerState = (state: boolean) => {
    setIsDrawerOpen(state);
    setSelectedItemId(null);
  };

  const handleEdit = () => {
    navigate(`/recipes/${selectedItemId}/edit`);
  };

  const handleDeleteModalOpen = () => {
    setIsDrawerOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    deleteRecipe();
  };

  const { mutate: deleteRecipe, isPending: isDeleting } =
    useDeleteRecipeMutation(selectedItemId ?? 0);

  useEffect(() => {
    animatedItemsRef.current.clear();
    // 레이아웃 변경 후 ScrollTrigger 위치 재계산이 필요할 수 있음 (옵션)
  }, [queryKeyString]);

  useEffect(() => {
    if (
      (isFetching && (!recipes || recipes.length === 0)) || // 초기 로딩
      !recipes ||
      recipes.length === 0 ||
      error ||
      noResults ||
      !itemsAnimateTargetRef.current ||
      !gridItemsContainerRef.current // 컨텍스트 ref
    ) {
      return;
    }

    // 스크롤 컨텍스트 설정 (컴포넌트 마운트 시 또는 필요시)
    // 예: gridItemsContainerRef.current가 스크롤 컨테이너라면 scrollContextRef.current = gridItemsContainerRef.current;
    // 여기서는 기본 window 스크롤을 가정하고 ScrollTrigger의 scroller를 명시하지 않음.

    const ctx = gsap.context(() => {
      const currentDOMItems = Array.from(
        itemsAnimateTargetRef.current!.children,
      );

      currentDOMItems.forEach((itemDOMElement: Element, index: number) => {
        if (!animatedItemsRef.current.has(itemDOMElement)) {
          gsap.set(itemDOMElement, { opacity: 0, y: 30, scale: 0.98 });
          gsap.to(itemDOMElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',

            delay: 0,
            scrollTrigger: {
              trigger: itemDOMElement,
              markers: true,
              scroller: gridItemsContainerRef.current, // 명시적 스크롤 컨테이너 사용 시
              start: 'top 95%', // 아이템 상단이 뷰포트 85% 지점에 닿으면
              toggleActions: 'play none none none', // 한 번만 재생
              // markers: process.env.NODE_ENV === 'development', // 개발 중에만 마커 표시
              // once: true, // GSAP 3.11+ 권장 (이 경우 아래 onEnter에서 add는 불필요하거나 다르게 처리)
              onEnter: () => {
                animatedItemsRef.current.add(itemDOMElement);
              },
            },
          });
        }
      });
      ScrollTrigger.refresh();
    }, gridItemsContainerRef); // 컨텍스트 범위는 gridItemsContainerRef

    return () => {
      ctx.revert();
    };
  }, [error, isFetching, noResults, recipes, queryKeyString]);
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
    <div ref={gridItemsContainerRef} className="flex flex-1 flex-col p-4">
      <div className="grid grid-cols-2 gap-4" ref={itemsAnimateTargetRef}>
        {recipes.map((recipe) =>
          isSimple ? (
            <SimpleRecipeGridItem
              key={recipe.id} // key는 필수
              recipe={recipe as BaseRecipeGridItem}
              height={height}
              setIsDrawerOpen={handleOpenDrawer}
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
      <div ref={observerRef} className="mt-2 h-10 text-center">
        {!isFetching &&
          !hasNextPage &&
          recipes &&
          recipes.length > 0 &&
          !error &&
          !noResults && (
            <p className="text-sm text-gray-500">{lastPageMessage}</p>
          )}
      </div>

      {isFetching && recipes && recipes.length > 0 && (
        <div className="flex items-center justify-center py-5">
          <Circle className="text-olive-light h-10 w-10" />
        </div>
      )}

      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} onOpenChange={handleDrawerState}>
          <DrawerContent className="p-4">
            <div className="absolute top-2 left-1/2 flex h-1 w-10 -translate-x-1/2 rounded-2xl bg-slate-400" />
            <div className="flex flex-col gap-2 rounded-2xl bg-gray-100 p-4">
              <button
                className="flex w-full justify-between"
                onClick={handleEdit}
              >
                <p>수정</p>
                <Pencil size={20} />
              </button>
              <div className="h-px w-full bg-gray-300" />
              <button
                className="flex w-full justify-between text-red-500"
                onClick={handleDeleteModalOpen}
              >
                <p>삭제</p>
                <Trash size={20} />
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="레시피를 삭제하시겠어요?"
          onConfirm={handleDelete}
          description="이 레시피를 삭제하면 복원할 수 없습니다."
        />
      )}
    </div>
  );
};

export default RecipeGrid;
