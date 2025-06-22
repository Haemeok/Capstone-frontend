import {
  addIngredient,
  addIngredientBulk,
  deleteIngredient,
  deleteIngredientBulk,
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
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  ingredient.id === ingredientId
                    ? { ...ingredient, inFridge: true }
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
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: currentQueryKey });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
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
            const idSet = new Set(ingredientIds);
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  idSet.has(ingredient.id)
                    ? { ...ingredient, inFridge: true }
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
const useDeleteIngredientBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[], IngredientMutationContext>({
    mutationFn: deleteIngredientBulk,
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
            const idSet = new Set(ingredientIds);
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((ingredient) =>
                  idSet.has(ingredient.id)
                    ? { ...ingredient, inFridge: true }
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
      console.error('재료 벌크 삭제 실패:', error);
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
  useDeleteIngredientBulkMutation,
};
