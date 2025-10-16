import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";

import { getRecipeOnServer } from "@/entities/recipe/model/api.server";
import { mockRecipeData } from "@/entities/recipe/model/mockData";

import RecipeDetailClient from "./components/RecipeDetailClient";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const recipe = await getRecipeOnServer(numericRecipeId);

  const useMockData =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const displayRecipe = useMockData ? mockRecipeData : recipe;

  if (!displayRecipe) {
    return generateNotFoundRecipeMetadata();
  }

  return generateRecipeMetadata(displayRecipe, recipeId);
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const recipe = await getRecipeOnServer(numericRecipeId);

  if (!recipe) {
    notFound();
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipe", numericRecipeId.toString()],
    queryFn: () => Promise.resolve(recipe),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeDetailClient recipeId={numericRecipeId} />
    </HydrationBoundary>
  );
}
