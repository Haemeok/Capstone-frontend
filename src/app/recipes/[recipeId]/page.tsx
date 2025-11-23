import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";

import {
  getStaticrecipionServer,
  getStaticRecipesOnServer,
} from "@/entities/recipe/model/api.server";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";

import { RecipeCompleteButton } from "@/features/recipe-complete";

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
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const staticRecipe = await getStaticrecipionServer(numericRecipeId);

  if (!staticRecipe) return generateNotFoundRecipeMetadata();

  return generateRecipeMetadata(staticRecipe, recipeId);
}

export async function generateStaticParams() {
  const recipes = await getStaticRecipesOnServer({
    period: "weekly",
    sort: "desc",
    key: "popular-recipes",
  });
  return recipes.content.map((recipe) => ({
    recipeId: recipe.id.toString(),
  }));
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const staticRecipe = await getStaticrecipionServer(numericRecipeId);

  if (!staticRecipe) {
    notFound();
  }

  const saveAmount =
    staticRecipe.marketPrice - staticRecipe.totalIngredientCost;

  return (
    <>
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

          <RecipeFabButton recipeId={numericRecipeId} />

          <RecipeIngredientsSection recipe={staticRecipe} />

          <RecipeCompleteButton
            recipeId={numericRecipeId}
            saveAmount={saveAmount}
            className="mt-4"
          />

          <CookingUnitTooltip />

          <RecipeStepList RecipeSteps={staticRecipe.steps} />
        </RecipeContainer>
      </RecipeStatusProvider>
      <DesktopFooter />
    </>
  );
}
