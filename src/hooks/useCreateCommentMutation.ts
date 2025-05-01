import { postComment, PostCommentParams } from '@/api/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/type/comment';
import { useToastStore } from '@/store/useToastStore';
const useCreateCommentMutation = (recipeId: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { mutate: createComment } = useMutation<
    Comment,
    Error,
    PostCommentParams
  >({
    mutationFn: (params: PostCommentParams) => postComment(params),
    onSuccess: (data, variables) => {
      const recipeIdString = recipeId.toString();
      queryClient.invalidateQueries({
        queryKey: ['comments', recipeIdString],
      });
      addToast({
        message: '댓글이 등록되었습니다.',
        variant: 'success',
      });
    },
    onError: (error) => {
      addToast({
        message: '댓글 등록에 실패했습니다.',
        variant: 'error',
      });
    },
  });

  return { createComment };
};

export default useCreateCommentMutation;
