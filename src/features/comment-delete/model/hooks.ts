import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateRecipeCache } from "@/app/recipes/[recipeId]/actions";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useToastStore } from "@/widgets/Toast/model/store";

import { deleteComment } from "./api";

export const useDeleteCommentMutation = (
  commentId: string,
  recipeId: string
) => {
  const queryClient = useQueryClient();
  const { addToast, removeToast } = useToastStore();
  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteComment({ commentId, recipeId }),
    onMutate: () => {
      const deletingToastId = addToast({
        message: "삭제 중...",
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
      await invalidateRecipeCache(recipeId);
      addToast({
        message: "댓글이 삭제되었습니다.",
        variant: "default",
        size: "small",
        position: "bottom",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      addToast({
        message: `삭제에 실패했습니다: ${errorMessage}`,
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
