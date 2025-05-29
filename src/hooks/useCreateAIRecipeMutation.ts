import { postAIRecommendedRecipe } from '@/api/recipe';
import { useMutation } from '@tanstack/react-query';

const useCreateAIRecipeMutation = () => {
  const { mutate: createAIRecipe, isPending } = useMutation({
    mutationFn: postAIRecommendedRecipe,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { createAIRecipe, isPending };
};

export default useCreateAIRecipeMutation;
