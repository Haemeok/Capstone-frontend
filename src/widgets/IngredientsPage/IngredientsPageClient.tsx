"use client";

import { Container } from "@/shared/ui/Container";

import { useUserStore } from "@/entities/user";

import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import { useInfiniteIngredients } from "./hooks/useInfiniteIngredients";
import { useIngredientsManager } from "./hooks/useIngredientsManager";
import { FridgeBottomAction } from "./ui/FridgeBottomAction";
import { FridgeHeader } from "./ui/FridgeHeader";
import { FridgeIngredientGrid } from "./ui/FridgeIngredientGrid";
import { IngredientAddEntry } from "./ui/IngredientAddEntry";
import { IngredientCategoryFilter } from "./ui/IngredientCategoryFilter";

const IngredientsPageClient = () => {
  const { user } = useUserStore();
  const {
    isDeleteMode,
    setIsDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  } = useIngredientsManager();
  const deleteMutation = useDeleteIngredientBulkMutation({
    onSuccess: () => setIsDeleteMode(false),
  });
  const ingredientsQuery = useInfiniteIngredients({
    category: selectedCategory,
    sort: "asc",
  });

  const ingredients = ingredientsQuery.ingredients ?? [];
  const selectedIds = new Set(selectedIngredientIds);
  const visibleIds = ingredients.map(({ id }) => id);
  const isAllSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const handleToggleSelectAll = () => {
    setSelectedIngredientIds(isAllSelected ? [] : visibleIds);
  };

  const handleToggleIngredient = (ingredientId: string) => {
    setSelectedIngredientIds((previous) =>
      previous.includes(ingredientId)
        ? previous.filter((id) => id !== ingredientId)
        : [...previous, ingredientId]
    );
  };

  return (
    <Container padding={false}>
      <main className="overflow-x-hidden pb-32">
        {user ? (
          <>
            <FridgeHeader
              totalCount={ingredientsQuery.totalCount}
              isTotalCountError={ingredientsQuery.isTotalCountError}
              isTotalCountPending={ingredientsQuery.isTotalCountPending}
              isManageMode={isDeleteMode}
              isAllSelected={isAllSelected}
              onEnterManageMode={() => setIsDeleteMode(true)}
              onToggleSelectAll={handleToggleSelectAll}
              onExitManageMode={() => setIsDeleteMode(false)}
            />
            {!isDeleteMode ? <IngredientAddEntry /> : null}
            <IngredientCategoryFilter
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </>
        ) : null}

        <FridgeIngredientGrid
          ingredients={ingredients}
          isLoggedIn={Boolean(user)}
          isManageMode={isDeleteMode}
          selectedIds={selectedIds}
          isPending={ingredientsQuery.isPending}
          isFetchingNextPage={ingredientsQuery.isFetchingNextPage}
          error={ingredientsQuery.error}
          sentinelRef={ingredientsQuery.ref}
          onToggle={handleToggleIngredient}
        />

        <FridgeBottomAction
          isLoggedIn={Boolean(user)}
          isManageMode={isDeleteMode}
          selectedCount={selectedIngredientIds.length}
          onDelete={() => deleteMutation.mutate(selectedIngredientIds)}
        />
      </main>
    </Container>
  );
};

export default IngredientsPageClient;
