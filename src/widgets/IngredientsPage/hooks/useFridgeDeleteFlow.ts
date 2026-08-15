import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

type UseFridgeDeleteFlowOptions = {
  selectedIngredientIds: ReadonlySet<string>;
  selectedIngredientNames: string[];
  onDeleteSuccess: () => void;
};

type ConfirmedSelection = {
  ids: string[];
  names: string[];
};

export const useFridgeDeleteFlow = ({
  selectedIngredientIds,
  selectedIngredientNames,
  onDeleteSuccess,
}: UseFridgeDeleteFlowOptions) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmedSelection, setConfirmedSelection] =
    useState<ConfirmedSelection>({ ids: [], names: [] });
  const mutation = useDeleteIngredientBulkMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      onDeleteSuccess();
    },
  });

  const clearErrorOnIntent = () => {
    if (mutation.isError && !mutation.isPending) mutation.reset();
  };

  const openDialog = () => {
    clearErrorOnIntent();
    setConfirmedSelection({
      ids: Array.from(selectedIngredientIds),
      names: [...selectedIngredientNames],
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mutation.isPending) return;
    triggerHaptic("Medium");
    mutation.mutate(confirmedSelection.ids, {
      onError: () => setIsDialogOpen(false),
    });
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedIngredientNames: confirmedSelection.names,
    isPending: mutation.isPending,
    error: mutation.error,
    clearErrorOnIntent,
    openDialog,
    confirmDelete,
  };
};
