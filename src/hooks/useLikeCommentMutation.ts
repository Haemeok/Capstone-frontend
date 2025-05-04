import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentsApiResponse, postCommentLike } from '@/api/comment'; // 좋아요/취소 API 함수
import { Comment } from '@/type/comment'; // 댓글 타입 가정

type LikeCommentMutationContext = {
  previousCommentsListData?: InfiniteData<CommentsApiResponse>; // onMutate에서 반환될 수 있으므로 optional로 처리하는 것이 더 안전할 수 있습니다.
};

export const useLikeCommentMutation = (
  commentId: number,
  recipeId: string | undefined,
) => {
  const queryClient = useQueryClient();
  // 쿼리 키 정의:
  // 1. 특정 레시피의 댓글 목록 (무한 스크롤)
  const commentsListQueryKey = ['comments', recipeId];
  // 2. (선택적) 개별 댓글 상세 정보 (만약 별도로 댓글 상세 데이터를 가져오는 기능이 있다면)
  // 여기서는 목록 업데이트에 집중하고, 개별 댓글 쿼리는 예시로 남겨둡니다.
  const commentQueryKey = ['comment', String(commentId)];

  return useMutation<
    // void, // postCommentLike가 반환하는 실제 타입으로 변경 가능 (예: { isLiked: boolean, likeCount: number })
    // API 성공 시 반환 타입을 명시하는 것이 좋습니다. 여기서는 void로 가정합니다.
    void, // postCommentLike의 실제 반환 타입으로 변경 권장
    Error, // 에러 타입
    void, // mutate 함수에 전달될 변수 타입 (낙관적 업데이트에 사용)
    LikeCommentMutationContext // 낙관적 업데이트에 사용될 컨텍스트 타입
  >({
    // 1. 실제 API 호출 함수 정의
    // mutate 함수가 호출될 때 실행됩니다.
    // commentId는 Hook의 인자로 받아왔으므로 여기서 직접 사용합니다.
    mutationFn: () => postCommentLike(commentId),

    // 2. onMutate: API 호출 직전에 실행 (Optimistic Update)
    // 이 함수는 UI를 즉시 업데이트하여 사용자 경험을 향상시킵니다.
    // mutate 함수에 전달된 변수({ like })를 여기서 받습니다.
    onMutate: async () => {
      // --- 낙관적 업데이트 시작 ---

      // 2-1. 관련 쿼리 리페치(refetch) 취소
      // API 응답이 오기 전에 낙관적 업데이트가 덮어쓰이는 것을 방지합니다.
      await queryClient.cancelQueries({ queryKey: commentsListQueryKey });

      // 2-2. 롤백(Rollback)을 위한 이전 캐시 데이터 저장
      // 만약 API 호출이 실패하면 이 데이터로 되돌립니다.
      const previousCommentsListData =
        queryClient.getQueryData<InfiniteData<CommentsApiResponse>>(
          commentsListQueryKey,
        );

      // 2-3. 캐시 데이터 즉시 업데이트 (UI 변경)

      // --- 댓글 목록 캐시 업데이트 (가장 중요) ---
      // 사용자가 보고 있는 댓글 목록 UI를 즉시 업데이트합니다.
      if (previousCommentsListData) {
        // setQueryData를 사용하여 캐시를 직접 수정합니다.
        queryClient.setQueryData<InfiniteData<CommentsApiResponse>>(
          commentsListQueryKey,
          (oldData) => {
            if (!oldData) return undefined; // 이전 데이터 없으면 업데이트 불가

            // InfiniteData 구조는 pages 배열을 가집니다. 각 page를 순회합니다.
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                // 각 page의 content 배열(댓글 목록)을 순회합니다.
                content: page.content.map((comment) =>
                  // 현재 처리 중인 댓글(commentId)을 찾습니다.
                  comment.id === commentId
                    ? // 찾았다면, isLiked와 likeCount를 낙관적으로 업데이트합니다.
                      {
                        ...comment,
                        isLiked: !comment.likedByCurrentUser, // mutate에 전달된 'like' 값 (true 또는 false)
                        // 'like'가 true이면 카운트 증가, false이면 감소
                        likeCount: comment.likedByCurrentUser
                          ? comment.likeCount - 1
                          : comment.likeCount + 1,
                      }
                    : // 다른 댓글은 그대로 둡니다.
                      comment,
                ),
              })),
            };
          },
        );
      }

      // 2-4. 롤백을 위해 이전 데이터 반환 (onError의 context로 전달됨)
      return { previousCommentsListData };
    },

    // 3. onError: API 호출 실패 시 실행
    // error: 발생한 에러 객체
    // variables: mutate 함수에 전달된 변수 ({ like })
    // context: onMutate에서 반환된 값 ({ previousCommentsListData, previousComment })
    onError: (error, variables, context) => {
      console.error('댓글 좋아요 처리 실패:', error);
      // --- 롤백 ---
      // 낙관적 업데이트로 변경했던 캐시 데이터를 이전 상태로 되돌립니다.
      if (context?.previousCommentsListData) {
        queryClient.setQueryData(
          commentsListQueryKey,
          context.previousCommentsListData,
        );
      }

      // 사용자에게 에러 알림 (예: 토스트 메시지)
      // alert('좋아요 처리에 실패했습니다.');
    },

    // 4. onSettled: API 호출 성공/실패 여부 관계없이 항상 실행
    // 낙관적 업데이트 후 서버의 최신 데이터와 동기화하기 위해 사용됩니다.
    onSettled: () => {
      // --- 캐시 무효화 (Invalidation) ---
      // 관련 쿼리를 '무효화'하여 React Query가 백그라운드에서
      // 최신 데이터를 다시 가져오도록(refetch) 합니다.
      // 이렇게 하면 낙관적 업데이트가 잘못되었더라도 결국 서버 데이터와 일치하게 됩니다.
      queryClient.invalidateQueries({ queryKey: commentsListQueryKey });
      // 개별 댓글 쿼리도 있다면 무효화
      queryClient.invalidateQueries({ queryKey: commentQueryKey });
    },
  });
};
