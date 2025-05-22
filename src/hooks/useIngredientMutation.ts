import {
  addIngredient,
  addIngredientBulk,
  deleteIngredient,
  IngredientsApiResponse,
} from '@/api/ingredient';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type IngredientMutationContext = {
  previousIngredientsListData?: InfiniteData<IngredientsApiResponse>;
};

const useAddIngredientMutation = (currentQueryKey: readonly unknown[]) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, number, IngredientMutationContext>({
    mutationFn: addIngredient,
    onMutate: async (ingredientId) => {
      console.log('onMutate', ingredientId);
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousIngredientsListData =
        queryClient.getQueryData<InfiniteData<IngredientsApiResponse>>(
          currentQueryKey,
        );

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          currentQueryKey,
          (oldData) => {
            if (!oldData) return undefined;
            console.log('oldData', oldData);
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  ingredient.id === ingredientId
                    ? { ...ingredient, inFridge: true } // 낙관적 업데이트
                    : ingredient,
                ),
              })),
            };
          },
        );
      }
      return { previousIngredientsListData };
    },
    onError: (error, variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          currentQueryKey,
          context.previousIngredientsListData,
        );
      }
      console.error('재료 추가 실패:', error);
      // 사용자에게 에러 알림 로직 추가 가능
    },

    // 6. 성공 또는 실패 여부와 관계없이 항상 실행 (데이터 재검증)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: currentQueryKey });
    },
  });

  return mutation;
};

const useDeleteIngredientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, IngredientMutationContext>({
    mutationFn: deleteIngredient,
    onMutate: async (ingredientId) => {
      await queryClient.cancelQueries({ queryKey: ['ingredients'] });
      const previousIngredientsListData = queryClient.getQueryData<
        InfiniteData<IngredientsApiResponse>
      >(['ingredients']);

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ['ingredients'],
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,

                content: page.content.filter(
                  (ingredient) => ingredient.id !== ingredientId,
                ),
              })),
            };
          },
        );
      }
      return { previousIngredientsListData };
    },
    onError: (error, variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ['ingredients'],
          context.previousIngredientsListData,
        );
      }
      console.error('재료 삭제 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
};

const useAddIngredientBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[], IngredientMutationContext>({
    // `number[]`는 재료 ID 배열
    mutationFn: addIngredientBulk,
    onMutate: async (ingredientIds) => {
      await queryClient.cancelQueries({ queryKey: ['ingredients'] });
      const previousIngredientsListData = queryClient.getQueryData<
        InfiniteData<IngredientsApiResponse>
      >(['ingredients']);

      if (previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ['ingredients'],
          (oldData) => {
            if (!oldData) return undefined;
            const idSet = new Set(ingredientIds); // 검색 효율을 위해 Set 사용
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  idSet.has(ingredient.id)
                    ? { ...ingredient, inFridge: true } // 낙관적 업데이트
                    : ingredient,
                ),
              })),
            };
          },
        );
      }
      return { previousIngredientsListData };
    },
    onError: (error, variables, context) => {
      if (context?.previousIngredientsListData) {
        queryClient.setQueryData<InfiniteData<IngredientsApiResponse>>(
          ['ingredients'],
          context.previousIngredientsListData,
        );
      }
      console.error('재료 벌크 추가 실패:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
};

export {
  useAddIngredientMutation,
  useDeleteIngredientMutation,
  useAddIngredientBulkMutation,
};
