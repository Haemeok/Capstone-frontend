import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@/store/useToastStore';
import { postRecipeVisibility } from '@/api/recipe';

const useRecipeVisibilityMutation = (recipeId: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const recipeVisibilityMutation = useMutation({
    mutationFn: () => postRecipeVisibility(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['recipe', recipeId.toString()],
      });
      addToast({
        message: '레시피 공개 상태가 변경되었습니다.',
        variant: 'default',
        size: 'small',
        position: 'bottom',
      });
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
    },
  });

  return recipeVisibilityMutation;
};

export default useRecipeVisibilityMutation;
