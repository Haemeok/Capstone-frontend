import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/shared/lib/metadata";
import { headers } from "next/headers";
import {
  getStaticrecipionServer,
  getStaticRecipesOnServer,
  getRecommendedRecipesOnServer,
} from "@/entities/recipe/model/api.server";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";

import { RecipeCompleteButton } from "@/features/recipe-complete";

import { RecipeContainer } from "./components/RecipeContainer";
import { RecipeStatusProvider } from "@/features/recipe-status";
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
import RecipeComponentsSection from "./components/RecipeComponentsSection";
import RecipePlatingSection from "./components/RecipePlatingSection";
import { CoupangDisclosure } from "./components/CoupangDisclosure";
import StaticRecipeSlide from "@/widgets/RecipeSlide/StaticRecipeSlide";
import RecipeVideoSection from "./components/RecipeVideoSection";
import { ScrollReset } from "./components/ScrollReset";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;

  const staticRecipe = await getStaticrecipionServer(recipeId);

  if (!staticRecipe) return generateNotFoundRecipeMetadata();

  return generateRecipeMetadata(staticRecipe, recipeId);
}

export async function generateStaticParams() {
  const recipes = await getStaticRecipesOnServer({
    period: "weekly",
    sort: "desc",
    key: "popular-recipes",
  });
  return recipes.content.filter((recipe) => recipe.imageUrl !== null);
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;

  const [staticRecipe, recommendedRecipes] = await Promise.all([
    getStaticrecipionServer(recipeId),
    getRecommendedRecipesOnServer(recipeId),
  ]);

  if (!staticRecipe) {
    notFound();
  }

  if (!staticRecipe.imageUrl) {
    headers();
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
    <ScrollReset>
      <RecipeStatusProvider recipeId={recipeId}>
        <RecipeNavbar
          title={staticRecipe.title}
          heroImageId="recipe-hero-image"
        />

        <RecipeHeroSection
          imageUrl={staticRecipe.imageUrl}
          title={staticRecipe.title}
          avgRating={staticRecipe.ratingInfo.avgRating}
          ratingCount={staticRecipe.ratingInfo.ratingCount}
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

          <RecipeVideoSection videoUrl={staticRecipe.youtubeUrl ?? ""}>
            <RecipeCommentsSection comments={staticRecipe.comments} />

            <RecipeFabButton hasAllStepImages={hasAllStepImages} />

            <RecipeIngredientsSection recipe={staticRecipe} />

            <RecipeCompleteButton saveAmount={saveAmount} className="mt-4" />

            <CoupangDisclosure />

            <CookingUnitTooltip />

            {staticRecipe.fineDiningInfo?.components && (
              <RecipeComponentsSection
                components={staticRecipe.fineDiningInfo.components}
              />
            )}

            <RecipeCookingTipsSection tips={staticRecipe.cookingTips} />

            <RecipeStepList RecipeSteps={staticRecipe.steps} />
          </RecipeVideoSection>

          {staticRecipe.fineDiningInfo?.plating && (
            <RecipePlatingSection
              vessel={staticRecipe.fineDiningInfo.plating.vessel}
              guide={staticRecipe.fineDiningInfo.plating.guide}
            />
          )}

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
    </ScrollReset>
  );
}
