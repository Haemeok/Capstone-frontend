import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRecipe } from '@/api/recipe';
import { Recipe } from '@/type/recipe';

const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (recipe: Recipe) => postRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  return mutation;
};

export default useCreateRecipeMutation;
