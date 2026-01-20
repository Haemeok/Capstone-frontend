import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invalidateRecipeCache } from "@/app/recipes/[recipeId]/actions";

import { postCommentWithRating } from "./api";

const usePostReviewMutation = (recipeId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      postCommentWithRating({ recipeId, comment, rating }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      await invalidateRecipeCache(recipeId);
    },
  });

  return mutation;
};

export default usePostReviewMutation;
