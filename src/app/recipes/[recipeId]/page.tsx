import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";

import { getStaticRecipeOnServer } from "@/entities/recipe/model/api.server";
import { mockRecipeData } from "@/entities/recipe/model/mockData";

import RecipeSteps from "@/entities/recipe/ui/RecipeStepList";

import { RecipeContainer } from "./components/RecipeContainer";
import { RecipeStatusProvider } from "./components/RecipeStatusProvider";
import RecipeNavbar from "./components/RecipeNavbar";
import RecipeHeroSection from "./components/RecipeHeroSection";
import RecipeInfoSection from "./components/RecipeInfoSection";
import RecipeInteractionBar from "./components/RecipeInteractionBar";
import RecipeCommentsSection from "./components/RecipeCommentsSection";
import RecipeIngredientsSection from "./components/RecipeIngredientsSection";
import RecipeFabButton from "./components/RecipeFabButton";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

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

  return (
    <RecipeStatusProvider recipeId={numericRecipeId}>
      <RecipeNavbar
        title={staticRecipe.title}
        recipeId={numericRecipeId}
        heroImageId="recipe-hero-image"
      />

      <RecipeHeroSection
        imageUrl={staticRecipe.imageUrl}
        title={staticRecipe.title}
        avgRating={staticRecipe.ratingInfo.avgRating}
        ratingCount={staticRecipe.ratingInfo.ratingCount}
        recipeId={numericRecipeId}
      />

      <RecipeContainer>
        <div className="px-2">
          <RecipeInfoSection
            title={staticRecipe.title}
            aiGenerated={staticRecipe.aiGenerated}
            author={staticRecipe.author}
            description={staticRecipe.description}
          >
            <RecipeInteractionBar staticRecipe={staticRecipe} />
          </RecipeInfoSection>

          <RecipeCommentsSection
            comments={staticRecipe.comments}
            recipeId={numericRecipeId}
          />

          <RecipeIngredientsSection recipe={staticRecipe} />

          <RecipeStepList RecipeSteps={staticRecipe.steps} />
        </div>

        <RecipeFabButton recipeId={numericRecipeId} />
      </RecipeContainer>
    </RecipeStatusProvider>
  );
}
