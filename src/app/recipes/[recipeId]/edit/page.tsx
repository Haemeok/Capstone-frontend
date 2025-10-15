import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getRecipeOnServer } from "@/entities/recipe/model/api.server";

import RecipeEditClient from "./components/RecipeEditClient";

type RecipeEditPageProps = {
  params: Promise<{ recipeId: string }>;
};

const RecipeEditPage = async ({ params }: RecipeEditPageProps) => {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipe", numericRecipeId.toString()],
    queryFn: () => getRecipeOnServer(numericRecipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeEditClient recipeId={numericRecipeId} />
    </HydrationBoundary>
  );
};

export default RecipeEditPage;
