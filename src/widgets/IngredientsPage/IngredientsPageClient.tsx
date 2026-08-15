"use client";

import { Container } from "@/shared/ui/Container";

import { useUserStore } from "@/entities/user";

import { useFridgeManagementActions } from "./hooks/useFridgeManagementActions";
import { useInfiniteIngredients } from "./hooks/useInfiniteIngredients";
import { useIngredientsManager } from "./hooks/useIngredientsManager";
import { FridgeBottomAction } from "./ui/FridgeBottomAction";
import { FridgeDeleteDialog } from "./ui/FridgeDeleteDialog";
import { FridgeDeleteError } from "./ui/FridgeDeleteError";
import { FridgeHeader } from "./ui/FridgeHeader";
import { FridgeIngredientGrid } from "./ui/FridgeIngredientGrid";
import { IngredientAddEntry } from "./ui/IngredientAddEntry";
import { IngredientCategoryFilter } from "./ui/IngredientCategoryFilter";

const IngredientsPageClient = () => {
  const { user } = useUserStore();
  const {
    mode,
    selectedCategory,
    selectedIngredientIds,
    selectedIngredientNames,
    setSelectedCategory,
    enterManageMode,
    exitManageMode,
    toggleIngredient,
    toggleAll,
  } = useIngredientsManager();
  const ingredientsQuery = useInfiniteIngredients({
    category: selectedCategory,
    sort: "asc",
  });

  const ingredients = ingredientsQuery.ingredients ?? [];
  const management = useFridgeManagementActions({
    ingredients,
    selectedIngredientIds,
    selectedIngredientNames,
    enterManageMode,
    exitManageMode,
    toggleIngredient,
    toggleAll,
  });

  return (
    <Container padding={false}>
      <main className="overflow-x-hidden pb-32">
        {user ? (
          <>
            <FridgeHeader
              totalCount={ingredientsQuery.totalCount}
              isTotalCountError={ingredientsQuery.isTotalCountError}
              isTotalCountPending={ingredientsQuery.isTotalCountPending}
              isManageMode={mode === "manage"}
              isAllSelected={management.isAllSelected}
              hasVisibleIngredients={ingredients.length > 0}
              manageButtonRef={management.manageButtonRef}
              onEnterManageMode={management.enterManageMode}
              onToggleSelectAll={management.toggleAll}
              onExitManageMode={management.exitManageMode}
            />
            {mode === "view" ? <IngredientAddEntry /> : null}
            <IngredientCategoryFilter
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </>
        ) : null}

        <FridgeIngredientGrid
          ingredients={ingredients}
          isLoggedIn={Boolean(user)}
          isManageMode={mode === "manage"}
          selectedIds={selectedIngredientIds}
          isPending={ingredientsQuery.isPending}
          isFetchingNextPage={ingredientsQuery.isFetchingNextPage}
          error={ingredientsQuery.error}
          sentinelRef={ingredientsQuery.ref}
          onToggle={management.toggleIngredient}
        />

        <FridgeDeleteError
          isVisible={mode === "manage" && Boolean(management.deleteFlow.error)}
        />

        <FridgeBottomAction
          isLoggedIn={Boolean(user)}
          isManageMode={mode === "manage"}
          selectedCount={selectedIngredientIds.size}
          deleteButtonRef={management.deleteButtonRef}
          onDelete={management.deleteFlow.openDialog}
        />

        <FridgeDeleteDialog
          isOpen={management.deleteFlow.isDialogOpen}
          isPending={management.deleteFlow.isPending}
          selectedNames={management.deleteFlow.selectedIngredientNames}
          returnFocusRef={
            mode === "manage"
              ? management.deleteButtonRef
              : management.manageButtonRef
          }
          onOpenChange={management.deleteFlow.setIsDialogOpen}
          onConfirm={management.deleteFlow.confirmDelete}
        />
      </main>
    </Container>
  );
};

export default IngredientsPageClient;
