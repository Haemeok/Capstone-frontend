import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";

import { getStaticRecipeOnServer } from "@/entities/recipe/model/api.server";
import { mockRecipeData } from "@/entities/recipe/model/mockData";

import RecipeDetailClient from "./components/RecipeDetailClient";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const staticRecipe = await getStaticRecipeOnServer(numericRecipeId);

  const useMockData =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const displayRecipe = useMockData ? mockRecipeData : staticRecipe;

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

  const staticRecipe = await getStaticRecipeOnServer(numericRecipeId);

  if (!staticRecipe) {
    notFound();
  }

  return <RecipeDetailClient staticRecipe={staticRecipe} recipeId={numericRecipeId} />;
}
