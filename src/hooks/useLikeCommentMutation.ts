import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentsApiResponse, postCommentLike } from '@/api/comment';
import useAuthenticatedAction from './useAuthenticatedAction';

type LikeCommentMutationContext = {
  previousCommentsListData?: InfiniteData<CommentsApiResponse>;
};

export const useLikeCommentMutation = (
  commentId: number,
  recipeId: string | undefined,
) => {
  const queryClient = useQueryClient();
  const commentsListQueryKey = ['comments', recipeId];

  const commentQueryKey = ['comment', String(commentId)];

  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    LikeCommentMutationContext
  >({
    mutationFn: () => postCommentLike(commentId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentsListQueryKey });

      const previousCommentsListData =
        queryClient.getQueryData<InfiniteData<CommentsApiResponse>>(
          commentsListQueryKey,
        );

      if (previousCommentsListData) {
        queryClient.setQueryData<InfiniteData<CommentsApiResponse>>(
          commentsListQueryKey,
          (oldData) => {
            if (!oldData) return undefined;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.likedByCurrentUser,
                        likeCount: comment.likedByCurrentUser
                          ? comment.likeCount - 1
                          : comment.likeCount + 1,
                      }
                    : comment,
                ),
              })),
            };
          },
        );
      }

      return { previousCommentsListData };
    },

    onError: (error, variables, context) => {
      console.error('댓글 좋아요 처리 실패:', error);
      if (context?.previousCommentsListData) {
        queryClient.setQueryData(
          commentsListQueryKey,
          context.previousCommentsListData,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsListQueryKey });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });

      queryClient.invalidateQueries({ queryKey: commentQueryKey });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, LikeCommentMutationContext> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
