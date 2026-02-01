import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeMetadata,
} from "@/entities/recipe/lib/metadata";
import {
  getRecommendedRecipesOnServer,
  getStaticRecipesOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import StaticRecipeSlide from "@/widgets/RecipeSlide/StaticRecipeSlide";

import { CoupangDisclosure } from "./components/CoupangDisclosure";
import RecentlyViewedTracker from "./components/RecentlyViewedTracker";
import RecipeCommentsSection from "./components/RecipeCommentsSection";
import RecipeComponentsSection from "./components/RecipeComponentsSection";
import { RecipeContainer } from "./components/RecipeContainer";
import RecipeCookingInfoSection from "./components/RecipeCookingInfoSection";
import RecipeCookingTipsSection from "./components/RecipeCookingTipsSection";
import RecipeFabButton from "./components/RecipeFabButton";
import RecipeHeroSection from "./components/RecipeHeroSection";
import RecipeInfoSection from "./components/RecipeInfoSection";
import RecipeIngredientsSection from "./components/RecipeIngredientsSection";
import RecipeInteractionBar from "./components/RecipeInteractionBar";
import RecipeNavbar from "./components/RecipeNavbar";
import RecipePlatingSection from "./components/RecipePlatingSection";
import RecipeTagsSection from "./components/RecipeTagsSection";
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
  console.log(staticRecipe);
  const saveAmount =
    staticRecipe.marketPrice - staticRecipe.totalIngredientCost;

  const hasAllStepImages = staticRecipe.steps.every(
    (step) => step.stepImageUrl !== null && step.stepImageUrl !== ""
  );

  const recommendLabel = staticRecipe.tags.includes("👨‍🍳 셰프 레시피")
    ? "더 다양한 셰프 레시피를 만나보세요"
    : "이런 레시피는 어떠신가요?";

  const youtubeMetadata = staticRecipe.youtubeChannelName
    ? {
        channelName: staticRecipe.youtubeChannelName,
        videoTitle: staticRecipe.youtubeVideoTitle,
        channelProfileUrl: staticRecipe.youtubeChannelProfileUrl,
        subscriberCount: staticRecipe.youtubeSubscriberCount,
        thumbnailUrl: staticRecipe.youtubeThumbnailUrl,
        channelId: staticRecipe.youtubeChannelId,
      }
    : undefined;

  return (
    <ScrollReset>
      <RecentlyViewedTracker
        recipeId={recipeId}
        title={staticRecipe.title}
        imageUrl={staticRecipe.imageUrl}
        authorName={staticRecipe.author.nickname}
        authorId={staticRecipe.author.id}
        profileImage={staticRecipe.author.profileImage}
        cookingTime={staticRecipe.cookingTime}
        avgRating={staticRecipe.ratingInfo.avgRating}
        ratingCount={staticRecipe.ratingInfo.ratingCount}
        isYoutube={!!staticRecipe.youtubeUrl}
      />
      <RecipeStatusProvider recipeId={recipeId}>
        <RecipeNavbar
          title={staticRecipe.title}
          heroImageId="recipe-hero-image"
        />

        <RecipeHeroSection
          recipeId={recipeId}
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
            extractorId={staticRecipe.extractorId}
          >
            <RecipeInteractionBar staticRecipe={staticRecipe} />
          </RecipeInfoSection>

          <RecipeCookingInfoSection
            cookingTime={staticRecipe.cookingTime}
            cookingTools={staticRecipe.cookingTools}
            servings={staticRecipe.servings}
          />

          <RecipeVideoSection
            videoUrl={staticRecipe.youtubeUrl ?? ""}
            youtubeMetadata={youtubeMetadata}
          >
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
