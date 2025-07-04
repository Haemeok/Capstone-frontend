import { useMutation } from "@tanstack/react-query";

import { postAIRecommendedRecipe } from "./api";

export const useCreateAIRecipeMutation = () => {
  const mutation = useMutation({
    mutationFn: postAIRecommendedRecipe,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    createAIRecipe: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};
