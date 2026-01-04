import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getrecipionServer } from "@/entities/recipe/model/api.server";

import RecipeEditClient from "./components/RecipeEditClient";

type RecipeEditPageProps = {
  params: Promise<{ recipeId: string }>;
};

const RecipeEditPage = async ({ params }: RecipeEditPageProps) => {
  const { recipeId } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getrecipionServer(recipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeEditClient recipeId={recipeId} />
    </HydrationBoundary>
  );
};

export default RecipeEditPage;
