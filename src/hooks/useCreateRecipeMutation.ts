import { useMutation } from '@tanstack/react-query';
import { postRecipe } from '@/api/recipe';
import { Recipe } from '@/type/recipe';

const useCreateRecipeMutation = () => {
  const mutation = useMutation({
    mutationFn: (recipe: Recipe) => postRecipe(recipe),
  });

  return mutation;
};

export default useCreateRecipeMutation;
