import React, { useEffect, useRef, useState } from 'react';
import { getIngredients } from '@/api/ingredient';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { IngredientsApiResponse } from '@/api/ingredient';
import { InfiniteData } from '@tanstack/react-query';
import { INGREDIENT_CATEGORIES } from '@/constants/recipe';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import gsap from 'gsap';
import { getNextPageParam } from '@/utils/recipe';
import IngredientGrid from './IngredientGrid';
import IngredientActionButtons from './IngredientActionButtons';
import { useDeleteIngredientBulkMutation } from '@/hooks/useIngredientMutation';

const IngredientsPage = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    [],
  );
  console.log(selectedIngredientIds);
  const { mutate: deleteIngredientBulk } = useDeleteIngredientBulkMutation();

  const { user } = useUserStore();
  const { data, error, hasNextPage, isFetchingNextPage, ref } =
    useInfiniteScroll<
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
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });

  const ingredients = data?.pages.flatMap((page) => page.content);

  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null);
  const gridAnimateTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0 || error) {
      return;
    }

    const ctx = gsap.context(() => {
      if (gridAnimateTargetRef.current) {
        const newItems = Array.from(
          gridAnimateTargetRef.current.querySelectorAll<HTMLElement>(
            ':scope > *:not([data-gsap-animated="true"])',
          ),
        );

        if (newItems.length > 0) {
          gsap.fromTo(
            newItems,
            { opacity: 0, y: 30, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: {
                each: 0.08,

                onStart: function () {},
              },
              ease: 'power2.out',

              scrollTrigger: {
                trigger: gridAnimateTargetRef.current,
                start: 'top 85%',
                markers: true,

                toggleActions: 'play none none none',
              },

              onComplete: () => {
                newItems.forEach((item) => {
                  item.setAttribute('data-gsap-animated', 'true');
                });
              },
            },
          );
        }
      }
    }, gridItemsContainerRef);

    return () => ctx.revert();
  }, [ingredients, error]);

  const handleDeleteIngredientBulk = () => {
    deleteIngredientBulk(selectedIngredientIds);
  };

  const headerTitle = user?.nickname
    ? `${user?.nickname}님의 냉장고`
    : '로그인 후 냉장고를 관리해보세요';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7f7] p-4">
        <h1 className="text-xl font-bold">{headerTitle}</h1>
        {!!user && (
          <IngredientActionButtons
            isDeleteMode={isDeleteMode}
            setIsDeleteMode={setIsDeleteMode}
            handleDeleteIngredientBulk={handleDeleteIngredientBulk}
          />
        )}
      </div>
      <div className="scrollbar-hide flex shrink-0 overflow-x-auto border-b border-gray-200">
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
      <IngredientGrid
        ingredients={ingredients ?? []}
        isDeleteMode={isDeleteMode}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        gridItemsContainerRef={gridItemsContainerRef}
        gridAnimateTargetRef={gridAnimateTargetRef}
        ref={ref}
        isLoggedIn={!!user}
        setSelectedIngredientIds={setSelectedIngredientIds}
      />
    </div>
  );
};

export default IngredientsPage;
