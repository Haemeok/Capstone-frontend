import {
  InfiniteData,
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { RecipeStatus } from "@/entities/recipe/model/types";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { CommentsApiResponse, postCommentLike } from "@/features/comment-like";

type LikeCommentMutationContext = {
  previousCommentsListData?: InfiniteData<CommentsApiResponse>;
  previousRecipeStatus?: RecipeStatus;
};

export const useLikeCommentMutation = (commentId: string, recipeId: string) => {
  const queryClient = useQueryClient();
  const commentsListQueryKey = ["comments", recipeId];
  const recipeStatusQueryKey = ["recipe-status", recipeId];
  const commentQueryKey = ["comment", String(commentId)];

  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    LikeCommentMutationContext
  >({
    mutationFn: () => postCommentLike(commentId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: commentsListQueryKey });
      await queryClient.cancelQueries({ queryKey: recipeStatusQueryKey });

      const previousCommentsListData =
        queryClient.getQueryData<InfiniteData<CommentsApiResponse>>(
          commentsListQueryKey
        );

      const previousRecipeStatus =
        queryClient.getQueryData<RecipeStatus>(recipeStatusQueryKey);

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
                    : comment
                ),
              })),
            };
          }
        );
      }

      if (previousRecipeStatus) {
        queryClient.setQueryData<RecipeStatus>(recipeStatusQueryKey, (old) =>
          old
            ? {
                ...old,
                comments: old.comments.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        likedByCurrentUser: !comment.likedByCurrentUser,
                        likeCount: comment.likedByCurrentUser
                          ? comment.likeCount - 1
                          : comment.likeCount + 1,
                      }
                    : comment
                ),
              }
            : undefined
        );
      }

      return { previousCommentsListData, previousRecipeStatus };
    },

    onError: (error, variables, context) => {
      console.error("댓글 좋아요 처리 실패:", error);
      if (context?.previousCommentsListData) {
        queryClient.setQueryData(
          commentsListQueryKey,
          context.previousCommentsListData
        );
      }
      if (context?.previousRecipeStatus) {
        queryClient.setQueryData(
          recipeStatusQueryKey,
          context.previousRecipeStatus
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsListQueryKey });
      queryClient.invalidateQueries({ queryKey: recipeStatusQueryKey });
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
