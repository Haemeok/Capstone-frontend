import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, getErrorData } from "@/shared/api/errors";
import { invalidateCache } from "@/shared/config/cache";
import { triggerHaptic } from "@/shared/lib/bridge";

import { Comment } from "@/entities/comment";

import { useToastStore } from "@/widgets/Toast/model/store";

import { postComment } from "./api";
import { CreateCommentMutationParams } from "./types";
import {
  NOT_READY_RETRY_COUNT,
  NOT_READY_RETRY_DELAY_MS,
  uploadCommentImages,
} from "./useCommentImageUpload";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isCommentImageNotReadyError = (e: unknown) => {
  if (!ApiError.isApiError(e) || e.status !== 409) return false;
  const code = getErrorData(e)?.code;
  return code === 308 || code === "308";
};

const postCommentWithRetry = async (
  params: Parameters<typeof postComment>[0]
): Promise<Comment> => {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= NOT_READY_RETRY_COUNT; attempt++) {
    try {
      return await postComment(params);
    } catch (e) {
      lastErr = e;
      const last = attempt === NOT_READY_RETRY_COUNT;
      if (!isCommentImageNotReadyError(e) || last) throw e;
      await sleep(NOT_READY_RETRY_DELAY_MS);
    }
  }
  throw lastErr;
};

const useCreateCommentMutation = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { mutate: createComment } = useMutation<
    Comment,
    Error,
    CreateCommentMutationParams
  >({
    mutationFn: async ({ file, ...params }) => {
      const imageKeys = file
        ? await uploadCommentImages(params.recipeId, [file])
        : undefined;
      return postCommentWithRetry({ ...params, imageKeys });
    },
    onSuccess: async () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe-status", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      await invalidateCache({ type: "COMMENT_CHANGED", recipeId });
      addToast({
        message: "댓글이 등록되었습니다.",
        variant: "success",
        position: "bottom",
      });
    },
    onError: (error) => {
      const message = isCommentImageNotReadyError(error)
        ? "이미지 처리 중이에요. 잠시 후 다시 시도해주세요."
        : "댓글 등록에 실패했습니다.";
      addToast({ message, variant: "error", position: "bottom" });
    },
  });

  return { createComment };
};

export default useCreateCommentMutation;
