import { getRecipeItems } from "@/api/recipe";
import { useQuery } from "@tanstack/react-query";

const useRecipeItemsQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeItems"],
    queryFn: getRecipeItems,
  });

  return { data, isLoading, error };
};

export default useRecipeItemsQuery;
