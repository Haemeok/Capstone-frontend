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
  isFetching,
  observerRef,
  noResults,
  noResultsMessage = '표시할 레시피가 없습니다.',
  lastPageMessage = '모든 레시피를 다 봤어요!',
  error,
  queryKeyString,
}: RecipeGridProps) => {
  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null);
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
  }, [queryKeyString]);

  useEffect(() => {
    if (
      (isFetching && (!recipes || recipes.length === 0)) ||
      !recipes ||
      recipes.length === 0 ||
      error ||
      noResults ||
      !itemsAnimateTargetRef.current ||
      !gridItemsContainerRef.current
    ) {
      return;
    }

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

              scroller: gridItemsContainerRef.current,
              start: 'top 95%',
              toggleActions: 'play none none none',
              onEnter: () => {
                animatedItemsRef.current.add(itemDOMElement);
              },
            },
          });
        }
      });
      ScrollTrigger.refresh();
    }, gridItemsContainerRef);

    return () => {
      ctx.revert();
    };
  }, [error, isFetching, noResults, recipes, queryKeyString]);

  if (isFetching && (!recipes || recipes.length === 0)) {
    return (
      <div className="flex h-[400px] flex-1 items-center justify-center py-10">
        <Circle className="text-olive-light h-15 w-15" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-base text-red-500">
        {error.message || '오류가 발생했습니다. 다시 시도해주세요.'}
      </p>
    );
  }

  if (noResults || !recipes || recipes.length === 0) {
    return (
      <p className="py-10 text-center text-base text-gray-500">
        {noResultsMessage}
      </p>
    );
  }

  return (
    <div ref={gridItemsContainerRef} className="flex flex-col p-4">
      <div className="grid grid-cols-2 gap-4" ref={itemsAnimateTargetRef}>
        {recipes.map((recipe) =>
          isSimple ? (
            <SimpleRecipeGridItem
              key={recipe.id}
              recipe={recipe as BaseRecipeGridItem}
              height={height}
              setIsDrawerOpen={handleOpenDrawer}
            />
          ) : (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={recipe as DetailedRecipeGridItemType}
              height={height}
            />
          ),
        )}
      </div>
      <div
        ref={observerRef}
        className="mt-2 flex h-10 items-center justify-center"
      >
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
