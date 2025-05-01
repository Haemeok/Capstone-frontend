import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { postRecipeLike, RecipesApiResponse } from '@/api/recipe'; // API 함수 예시
import { Recipe } from '@/type/recipe'; // 레시피 타입 예시

// Context 타입 정의 (낙관적 업데이트 시 필요)
type LikeRecipeMutationContext = {
  previousRecipeDetail?: Recipe;
  previousRecipeListData?: InfiniteData<RecipesApiResponse>;
  // 다른 리스트 타입이 있다면 추가...
};

export const useLikeRecipeMutation = (recipeId: number) => {
  const queryClient = useQueryClient();

  // 쿼리 키 정의
  const recipeDetailQueryKey = ['recipe', recipeId];
  // 리스트 쿼리 키는 여러 개일 수 있습니다.
  // 예: 최신순 목록 ['recipes', { sort: 'newest' }]
  // 예: 인기순 목록 ['recipes', { sort: 'popular' }]
  // 여기서는 간단히 루트 키만 사용하거나, 더 구체적인 키 배열을 사용합니다.
  // 모든 레시피 리스트를 무효화하려면 루트 키 사용:
  const recipesListRootKey = ['recipes'];

  return useMutation<
    void, // API 응답 타입
    Error,
    void, // mutate 함수 인자 타입 (API가 토글이므로 인자 필요 없음)
    LikeRecipeMutationContext // Context 타입
  >({
    mutationFn: () => postRecipeLike(recipeId), // recipeId를 사용하여 API 호출

    onMutate: async () => {
      // --- 낙관적 업데이트 (선택적이지만 좋은 UX 제공) ---
      // 1. 관련 쿼리 취소
      await queryClient.cancelQueries({ queryKey: recipeDetailQueryKey });
      await queryClient.cancelQueries({ queryKey: recipesListRootKey }); // 모든 리스트 쿼리 취소

      // 2. 이전 데이터 저장
      const previousRecipeDetail =
        queryClient.getQueryData<Recipe>(recipeDetailQueryKey);
      // 리스트 데이터도 찾아서 업데이트 (더 복잡) - 여기서는 예시로 하나만 처리
      // 실제로는 활성화된 모든 레시피 리스트 쿼리를 찾아 업데이트해야 할 수 있음
      const previousRecipeListData =
        queryClient.getQueryData<InfiniteData<RecipesApiResponse>>(
          recipesListRootKey,
        ); // 또는 더 구체적인 키

      // 3. 캐시 즉시 업데이트 (Detail)
      if (previousRecipeDetail) {
        queryClient.setQueryData<Recipe>(recipeDetailQueryKey, (old) =>
          old
            ? {
                ...old,
                likedByCurrentUser: !old.likedByCurrentUser, // 상태 반전
                likeCount: old.likedByCurrentUser
                  ? old.likeCount - 1
                  : old.likeCount + 1, // 카운트 변경
              }
            : undefined,
        );
      }

      // 3. 캐시 즉시 업데이트 (List) - 구현이 복잡할 수 있음
      if (previousRecipeListData) {
        queryClient.setQueryData<InfiniteData<RecipesApiResponse>>(
          recipesListRootKey,
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                // 가정: page.content 또는 유사한 속성에 Recipe[] 가 있음
                content: page.content.map((recipe) =>
                  recipe.id === recipeId
                    ? {
                        ...recipe,
                        likedByCurrentUser: !recipe.likedByCurrentUser,
                        likeCount: recipe.likedByCurrentUser
                          ? recipe.likeCount - 1
                          : recipe.likeCount + 1,
                      }
                    : recipe,
                ),
              })),
            };
          },
        );
      }

      // 4. 이전 데이터 반환
      return { previousRecipeDetail, previousRecipeListData };
    },

    onError: (error, variables, context) => {
      // 롤백 로직: context에 저장된 이전 데이터로 복원
      if (context?.previousRecipeDetail) {
        queryClient.setQueryData(
          recipeDetailQueryKey,
          context.previousRecipeDetail,
        );
      }
      if (context?.previousRecipeListData) {
        queryClient.setQueryData(
          recipesListRootKey,
          context.previousRecipeListData,
        );
      }
      console.error('좋아요 처리 실패:', error);
    },

    onSettled: () => {
      // --- 캐시 무효화 (서버 데이터와 최종 동기화) ---
      // 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: recipeDetailQueryKey });
      // 모든 리스트 캐시 무효화 (또는 더 구체적인 키 사용)
      queryClient.invalidateQueries({ queryKey: recipesListRootKey });
    },
  });
};

// 사용 예시:
// 1. 레시피 상세 페이지
// const { mutate: toggleLike } = useLikeRecipeMutation(recipe.id);
// <button onClick={() => toggleLike()}>Like</button>

// 2. 레시피 리스트 아이템
// const { mutate: toggleLike } = useLikeRecipeMutation(recipe.id);
// <button onClick={() => toggleLike()}>Like</button>
