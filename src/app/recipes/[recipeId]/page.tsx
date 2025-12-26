import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";

import {
  getStaticrecipionServer,
  getStaticRecipesOnServer,
  getRecommendedRecipesOnServer,
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
import RecipeTagsSection from "./components/RecipeTagsSection";
import RecipeCookingInfoSection from "./components/RecipeCookingInfoSection";
import RecipeCookingTipsSection from "./components/RecipeCookingTipsSection";
import { CoupangDisclosure } from "./components/CoupangDisclosure";
import StaticRecipeSlide from "@/widgets/RecipeSlide/StaticRecipeSlide";

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

  const [staticRecipe, recommendedRecipes] = await Promise.all([
    getStaticrecipionServer(numericRecipeId),
    getRecommendedRecipesOnServer(numericRecipeId),
  ]);

  if (!staticRecipe) {
    notFound();
  }

  const saveAmount =
    staticRecipe.marketPrice - staticRecipe.totalIngredientCost;

  const hasAllStepImages = staticRecipe.steps.every(
    (step) => step.stepImageUrl !== null && step.stepImageUrl !== ""
  );

  const recommendLabel = staticRecipe.tags.includes("👨‍🍳 셰프 레시피")
    ? "더 다양한 셰프 레시피를 만나보세요"
    : "이런 레시피는 어떠신가요?";

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

          <RecipeCookingInfoSection
            cookingTime={staticRecipe.cookingTime}
            cookingTools={staticRecipe.cookingTools}
            servings={staticRecipe.servings}
          />

          <RecipeCommentsSection
            comments={staticRecipe.comments}
            recipeId={numericRecipeId}
          />

          <RecipeFabButton
            recipeId={numericRecipeId}
            hasAllStepImages={hasAllStepImages}
          />

          <RecipeIngredientsSection recipe={staticRecipe} />

          <RecipeCompleteButton
            recipeId={numericRecipeId}
            saveAmount={saveAmount}
            className="mt-4"
          />

          <CoupangDisclosure />

          <CookingUnitTooltip />

          <RecipeCookingTipsSection tips={staticRecipe.cookingTips} />

          <RecipeStepList RecipeSteps={staticRecipe.steps} />

          <RecipeTagsSection tags={staticRecipe.tags} />

          {recommendedRecipes.length > 0 && (
            <StaticRecipeSlide
              title={recommendLabel}
              staticRecipes={recommendedRecipes}
            />
          )}
        </RecipeContainer>
      </RecipeStatusProvider>
      <DesktopFooter />
    </>
  );
}
