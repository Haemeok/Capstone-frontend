"use client";

import React, { useRef, useState } from "react";

import {
  INGREDIENT_CATEGORIES,
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import { ExpandableFabButton } from "@/shared/ui/ExpandableFabButton";

import { useUserStore } from "@/entities/user";

import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import DeleteModeFabButton from "@/widgets/IngredientGrid/ui/DeleteModeFabButton";
import IngredientActionButtons from "@/widgets/IngredientGrid/ui/IngredientActionButtons";
import IngredientGrid from "@/widgets/IngredientGrid/ui/IngredientGrid";

import { useInfiniteIngredients } from "./hooks/useInfiniteIngredients";
import { useIngredientsManager } from "./hooks/useIngredientsManager";

const IngredientsPageClient = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [sort] = useState<"asc" | "desc">("asc");

  const { user } = useUserStore();

  const {
    isDeleteMode,
    setIsDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  } = useIngredientsManager();

  const { mutate: deleteIngredientBulk } = useDeleteIngredientBulkMutation({
    onSuccess: () => {
      setIsDeleteMode(false);
    },
  });

  const { error, hasNextPage, isFetchingNextPage, ref, ingredients } =
    useInfiniteIngredients({
      category: selectedCategory,
      sort,
    });

  const handleDeleteIngredientBulk = () => {
    deleteIngredientBulk(selectedIngredientIds);
  };

  const allIngredientIds = ingredients?.map((i) => i.id) ?? [];
  const isAllSelected =
    allIngredientIds.length > 0 &&
    allIngredientIds.every((id) => selectedIngredientIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIngredientIds([]);
    } else {
      setSelectedIngredientIds(allIngredientIds);
    }
  };

  const headerTitle = !!user
    ? `${user?.nickname}님의\n냉장고`
    : "로그인 후 냉장고를\n관리해보세요";

  return (
    <Container padding={false}>
      <div className="flex flex-col">
        <div ref={observerRef} className="w-full" />
        <div className="z-sticky sticky-optimized sticky top-0 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h1 className="text-xl font-bold whitespace-pre-line">
              {headerTitle}
            </h1>
            {!!user && (
              <IngredientActionButtons
                isDeleteMode={isDeleteMode}
                setIsDeleteMode={setIsDeleteMode}
                onToggleSelectAll={handleToggleSelectAll}
                isAllSelected={isAllSelected}
              />
            )}
          </div>
          <div className="scrollbar-hide flex shrink-0 overflow-x-auto border-b border-gray-200">
            {INGREDIENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex-shrink-0 px-4 py-3 text-sm font-medium",
                  selectedCategory === category
                    ? "text-olive-light"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <IngredientGrid
          ingredients={ingredients ?? []}
          isDeleteMode={isDeleteMode}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          error={error}
          ref={ref}
          isLoggedIn={!!user}
          setSelectedIngredientIds={setSelectedIngredientIds}
          selectedIngredientIds={selectedIngredientIds}
        />

        {!!user && !isDeleteMode && (
          <ExpandableFabButton
            icon={
              <Image
                src={`${ICON_BASE_URL}cook_button.webp`}
                alt="요리"
                wrapperClassName="w-8 h-8"
              />
            }
            ariaLabel="레시피 옵션"
            animated={true}
            triggerRef={observerRef}
            items={[
              {
                icon: (
                  <Image
                    src={`${ICON_BASE_URL}cookable_list.webp`}
                    alt="냉장고"
                    wrapperClassName="w-6 h-6"
                  />
                ),
                label: "내 냉장고로 레시피 찾기",
                href: "/recipes/my-fridge",
                prefetch: false,
              },
              {
                icon: (
                  <Image
                    src={`${ICON_BASE_URL}ai.webp`}
                    alt="AI"
                    wrapperClassName="w-6 h-6"
                  />
                ),
                label: "AI로 생성하기",
                href: "/recipes/new/ai/ingredient",
                prefetch: false,
              },
            ]}
          />
        )}

        {!!user && isDeleteMode && (
          <DeleteModeFabButton
            selectedCount={selectedIngredientIds.length}
            onDelete={handleDeleteIngredientBulk}
          />
        )}
      </div>
    </Container>
  );
};

export default IngredientsPageClient;
