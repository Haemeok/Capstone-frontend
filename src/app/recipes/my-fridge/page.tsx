"use client";

import { getMyIngredientRecipes } from "@/entities/recipe/model/api";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

const MyFridgePage = () => {
  const { ref, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteScroll({
      queryKey: ["my-fridge-recipes"],
      queryFn: getMyIngredientRecipes,
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
    });
  return <div>MyFridgePage</div>;
};

export default MyFridgePage;
