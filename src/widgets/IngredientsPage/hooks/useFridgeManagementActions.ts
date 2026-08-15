import { useRef } from "react";

import type { IngredientItem } from "@/entities/ingredient";

import { useFridgeDeleteFlow } from "./useFridgeDeleteFlow";

type UseFridgeManagementActionsOptions = {
  ingredients: IngredientItem[];
  selectedIngredientIds: ReadonlySet<string>;
  selectedIngredientNames: string[];
  enterManageMode: () => void;
  exitManageMode: () => void;
  toggleIngredient: (ingredient: IngredientItem) => void;
  toggleAll: (ingredients: IngredientItem[]) => void;
};

export const useFridgeManagementActions = ({
  ingredients,
  selectedIngredientIds,
  selectedIngredientNames,
  enterManageMode,
  exitManageMode,
  toggleIngredient,
  toggleAll,
}: UseFridgeManagementActionsOptions) => {
  const manageButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const deleteFlow = useFridgeDeleteFlow({
    selectedIngredientIds,
    selectedIngredientNames,
    onDeleteSuccess: exitManageMode,
  });
  const visibleIds = ingredients.map(({ id }) => id);
  const isAllSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIngredientIds.has(id));

  const runWithFreshError = (action: () => void) => {
    deleteFlow.clearErrorOnIntent();
    action();
  };

  return {
    deleteFlow,
    manageButtonRef,
    deleteButtonRef,
    isAllSelected,
    enterManageMode: () => runWithFreshError(enterManageMode),
    exitManageMode: () => runWithFreshError(exitManageMode),
    toggleIngredient: (ingredient: IngredientItem) =>
      runWithFreshError(() => toggleIngredient(ingredient)),
    toggleAll: () => {
      if (ingredients.length === 0) return;
      runWithFreshError(() => toggleAll(ingredients));
    },
  };
};
