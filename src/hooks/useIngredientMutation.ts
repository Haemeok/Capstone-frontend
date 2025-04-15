import {
  addIngredient,
  addIngredientBulk,
  deleteIngredient,
} from '@/api/ingredient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAddIngredientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  return mutation;
};

const useDeleteIngredientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  return mutation;
};

const useAddIngredientBulkMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addIngredientBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  return mutation;
};

export {
  useAddIngredientMutation,
  useDeleteIngredientMutation,
  useAddIngredientBulkMutation,
};
