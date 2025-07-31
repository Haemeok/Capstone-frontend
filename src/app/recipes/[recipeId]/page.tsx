import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRecipeOnServer } from "@/entities/recipe/model/api.server";
import { mockRecipeData } from "@/entities/recipe/model/mockData";
import { Recipe } from "@/entities/recipe/model/types";
import {
  generateRecipeMetadata,
  generateNotFoundRecipeMetadata,
} from "@/shared/lib/metadata";

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

  const useMockData =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const displayRecipe = useMockData ? mockRecipeData : recipe;

  if (!displayRecipe) {
    notFound();
  }

  const baseRecipe = displayRecipe as Recipe;

  return <RecipeDetailClient initialRecipe={baseRecipe} />;
}
