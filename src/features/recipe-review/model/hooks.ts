import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCommentWithRating } from "./api";

const usePostReviewMutation = (recipeId: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      postCommentWithRating({ recipeId, comment, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  return mutation;
};

export default usePostReviewMutation;
