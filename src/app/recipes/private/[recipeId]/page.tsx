import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot, InArticleAdSlot } from "@/shared/adsense";
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { isAiRecipe, isPrivateRecipe, isYoutubeRecipe } from "@/entities/recipe";
import { getPrivateRecipeOnServer } from "@/entities/recipe/model/api.server";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { ChatLauncher } from "@/features/recipe-chat";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";
import { SmartAppBanner } from "@/features/smart-app-banner";

import { CoupangDisclosure } from "../../[recipeId]/components/CoupangDisclosure";
import LazyRecommendedRecipeSlide from "../../[recipeId]/components/LazyRecommendedRecipeSlide";
import RecentlyViewedTracker from "../../[recipeId]/components/RecentlyViewedTracker";
import RecipeCommentsSection from "../../[recipeId]/components/RecipeCommentsSection";
import RecipeComponentsSection from "../../[recipeId]/components/RecipeComponentsSection";
import { RecipeContainer } from "../../[recipeId]/components/RecipeContainer";
import RecipeCookingInfoSection from "../../[recipeId]/components/RecipeCookingInfoSection";
import RecipeCookingTipsSection from "../../[recipeId]/components/RecipeCookingTipsSection";
import RecipeHeroSection from "../../[recipeId]/components/RecipeHeroSection";
import RecipeInfoSection from "../../[recipeId]/components/RecipeInfoSection";
import RecipeIngredientsSection from "../../[recipeId]/components/RecipeIngredientsSection";
import RecipeInteractionBar from "../../[recipeId]/components/RecipeInteractionBar";
import RecipeNavbar from "../../[recipeId]/components/RecipeNavbar";
import RecipePlatingSection from "../../[recipeId]/components/RecipePlatingSection";
import RecipeTagsSection from "../../[recipeId]/components/RecipeTagsSection";
import RecipeVideoSection from "../../[recipeId]/components/RecipeVideoSection";
import { ScrollReset } from "../../[recipeId]/components/ScrollReset";

interface PrivateRecipePageProps {
  params: Promise<{ recipeId: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PrivateRecipePage({
  params,
}: PrivateRecipePageProps) {
  const { recipeId } = await params;

  const recipe = await getPrivateRecipeOnServer(recipeId);

  // 404 / 401 / 403 / 비공개 아님 → 모두 notFound()
  if (!recipe || !isPrivateRecipe(recipe)) {
    notFound();
  }

  const saveAmount = recipe.marketPrice - recipe.totalIngredientCost;

  const youtubeMetadata = recipe.youtubeChannelName
    ? {
        channelName: recipe.youtubeChannelName,
        videoTitle: recipe.youtubeVideoTitle,
        channelProfileUrl: recipe.youtubeChannelProfileUrl,
        subscriberCount: recipe.youtubeSubscriberCount,
        thumbnailUrl: recipe.youtubeThumbnailUrl,
        channelId: recipe.youtubeChannelId,
      }
    : undefined;

  return (
    <ScrollReset>
      <RecentlyViewedTracker
        recipeId={recipeId}
        title={recipe.title}
        imageUrl={recipe.imageUrl}
        authorName={recipe.author.nickname}
        authorId={recipe.author.id}
        profileImage={recipe.author.profileImage}
        cookingTime={recipe.cookingTime}
        avgRating={recipe.ratingInfo.avgRating}
        ratingCount={recipe.ratingInfo.ratingCount}
        isYoutube={isYoutubeRecipe(recipe)}
        youtubeChannelName={recipe.youtubeChannelName}
        isAiGenerated={isAiRecipe(recipe)}
      />
      <RecipeStatusProvider recipeId={recipeId}>
        <RecipeNavbar
          title={recipe.title}
          heroImageId="recipe-hero-image"
        />

        <RecipeHeroSection
          recipeId={recipeId}
          imageUrl={recipe.imageUrl}
          title={recipe.title}
          avgRating={recipe.ratingInfo.avgRating}
          ratingCount={recipe.ratingInfo.ratingCount}
        />

        <RecipeContainer>
          <RecipeInfoSection
            title={recipe.title}
            aiGenerated={isAiRecipe(recipe)}
            author={recipe.author}
            description={recipe.description}
            extractorId={recipe.extractorId}
          >
            <RecipeInteractionBar staticRecipe={recipe} />
          </RecipeInfoSection>

          <RecipeCookingInfoSection
            cookingTime={recipe.cookingTime}
            cookingTools={recipe.cookingTools}
            servings={recipe.servings}
          />

          <ErrorBoundary
            fallback={
              <SectionErrorFallback message="비디오를 불러올 수 없어요" />
            }
          >
            <RecipeVideoSection
              videoUrl={recipe.youtubeUrl ?? ""}
              youtubeMetadata={youtubeMetadata}
            >
              <InArticleAdSlot />

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="댓글을 불러올 수 없어요" />
                }
              >
                <RecipeCommentsSection comments={recipe.comments} />
              </ErrorBoundary>

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="재료 정보를 불러올 수 없어요" />
                }
              >
                <RecipeIngredientsSection recipe={recipe} />
              </ErrorBoundary>

              <RecipeCompleteButton saveAmount={saveAmount} className="mt-4" />

              <CoupangDisclosure />

              {recipe.fineDiningInfo?.components && (
                <RecipeComponentsSection
                  components={recipe.fineDiningInfo.components}
                />
              )}

              <RecipeCookingTipsSection
                tips={recipe.cookingTips}
                headerExtra={<CookingUnitTooltip inline />}
              />

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="조리 순서를 불러올 수 없어요" />
                }
              >
                <RecipeStepList
                  RecipeSteps={recipe.steps}
                  recipeIngredients={recipe.ingredients}
                />
              </ErrorBoundary>
            </RecipeVideoSection>
          </ErrorBoundary>

          {recipe.fineDiningInfo?.plating && (
            <RecipePlatingSection
              vessel={recipe.fineDiningInfo.plating.vessel}
              guide={recipe.fineDiningInfo.plating.guide}
            />
          )}

          <RecipeTagsSection tags={recipe.tags} />

          <Suspense fallback={null}>
            <LazyRecommendedRecipeSlide
              recipeId={recipeId}
              tags={recipe.tags}
            />
          </Suspense>
        </RecipeContainer>
        <ChatLauncher recipeId={recipeId} />
      </RecipeStatusProvider>
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
}
