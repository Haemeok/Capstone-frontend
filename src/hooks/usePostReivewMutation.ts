import { postCommentWithRating } from '@/api/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePostReviewMutation = (recipeId: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      postCommentWithRating({ recipeId, comment, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return mutation;
};

export default usePostReviewMutation;
