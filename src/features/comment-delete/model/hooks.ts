import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateCache } from "@/shared/config/cache";
import { format, useCommentsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast/model/store";

import { deleteComment } from "./api";

export const useDeleteCommentMutation = (
  commentId: string,
  recipeId: string
) => {
  const queryClient = useQueryClient();
  const { addToast, removeToast } = useToastStore();
  const t = useCommentsDict();
  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteComment({ commentId, recipeId }),
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
    onSuccess: async () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      await invalidateCache({ type: "COMMENT_CHANGED", recipeId });
      addToast({
        message: t.deleteSuccess,
        variant: "default",
        size: "small",
        position: "bottom",
      });
    },
    onError: (error) => {
      const reason = error instanceof Error ? error.message : "";

      addToast({
        message: format(t.deleteError, { message: reason }),
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

  return deleteCommentMutation;
};
