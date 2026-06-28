import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { format, useCommonDict, useRecipeActionsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { deleteRecipe } from "./api";

const useDeleteRecipeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { addToast, removeToast } = useToastStore();
  const tc = useCommonDict();
  const t = useRecipeActionsDict();
  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(recipeId),
    onMutate: () => {
      const deletingToastId = addToast({
        message: t.deleting,
        variant: "default",
        size: "small",
        position: "middle",
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      addToast({
        message: t.deleteSuccess,
        variant: "default",
        size: "small",
        position: "bottom",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : tc.errors.unknown;

      addToast({
        message: format(t.deleteError, { message: errorMessage }),
        variant: "error",
        position: "middle",
      });
    },
    onSettled: (data, error, variables, context) => {
      if (context?.deletingToastId) {
        removeToast(context.deletingToastId);
      }
    },
  });

  return deleteRecipeMutation;
};

export default useDeleteRecipeMutation;
