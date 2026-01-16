import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Comment } from "@/entities/comment";

import { useToastStore } from "@/widgets/Toast/model/store";

import { postComment } from "./api";
import { PostCommentParams } from "./types";

const useCreateCommentMutation = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { mutate: createComment } = useMutation<
    Comment,
    Error,
    PostCommentParams
  >({
    mutationFn: (params: PostCommentParams) => postComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recipe-status", recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
      });
      addToast({
        message: "댓글이 등록되었습니다.",
        variant: "success",
        position: "bottom",
      });
    },
    onError: () => {
      addToast({
        message: "댓글 등록에 실패했습니다.",
        variant: "error",
        position: "bottom",
      });
    },
  });

  return { createComment };
};

export default useCreateCommentMutation;
