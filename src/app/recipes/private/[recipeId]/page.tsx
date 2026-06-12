import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot, InArticleAdSlot } from "@/shared/adsense";
import { DictionaryProvider, getDictionary } from "@/shared/i18n";
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ScrollReset } from "@/shared/ui/ScrollReset";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import {
  isAiRecipe,
  isPrivateRecipe,
  isYoutubeRecipe,
} from "@/entities/recipe";
import { getPrivateRecipeOnServer } from "@/entities/recipe/model/api.server";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { ChatLauncher } from "@/features/recipe-chat";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";
import { SmartAppBanner } from "@/features/smart-app-banner";

import { CoupangDisclosure } from "@/widgets/RecipeDetailView/ui/CoupangDisclosure";
import LazyRecommendedRecipeSlide from "@/widgets/RecipeDetailView/ui/LazyRecommendedRecipeSlide";
import RecentlyViewedTracker from "@/widgets/RecipeDetailView/ui/RecentlyViewedTracker";
import RecipeCommentsSection from "@/widgets/RecipeDetailView/ui/RecipeCommentsSection";
import RecipeComponentsSection from "@/widgets/RecipeDetailView/ui/RecipeComponentsSection";
import { RecipeContainer } from "@/widgets/RecipeDetailView/ui/RecipeContainer";
import RecipeCookingInfoSection from "@/widgets/RecipeDetailView/ui/RecipeCookingInfoSection";
import RecipeCookingTipsSection from "@/widgets/RecipeDetailView/ui/RecipeCookingTipsSection";
import RecipeHeroSection from "@/widgets/RecipeDetailView/ui/RecipeHeroSection";
import RecipeInfoSection from "@/widgets/RecipeDetailView/ui/RecipeInfoSection";
import RecipeIngredientsSection from "@/widgets/RecipeDetailView/ui/RecipeIngredientsSection";
import RecipeInteractionBar from "@/widgets/RecipeDetailView/ui/RecipeInteractionBar";
import RecipeNavbar from "@/widgets/RecipeDetailView/ui/RecipeNavbar";
import RecipePlatingSection from "@/widgets/RecipeDetailView/ui/RecipePlatingSection";
import RecipeTagsSection from "@/widgets/RecipeDetailView/ui/RecipeTagsSection";
import RecipeVideoSection from "@/widgets/RecipeDetailView/ui/RecipeVideoSection";

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

  const locale = "ko" as const;
  const t = getDictionary(locale);
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
      <DictionaryProvider dict={t}>
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
          <RecipeNavbar title={recipe.title} heroImageId="recipe-hero-image" />

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
              locale={locale}
            >
              <RecipeInteractionBar staticRecipe={recipe} />
            </RecipeInfoSection>

            <RecipeCookingInfoSection
              cookingTime={recipe.cookingTime}
              cookingTools={recipe.cookingTools}
              servings={recipe.servings}
              locale={locale}
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
                  <RecipeCommentsSection
                    comments={recipe.comments}
                    locale={locale}
                  />
                </ErrorBoundary>

                <ErrorBoundary
                  fallback={
                    <SectionErrorFallback message="재료 정보를 불러올 수 없어요" />
                  }
                >
                  <RecipeIngredientsSection recipe={recipe} />
                </ErrorBoundary>

                <RecipeCompleteButton
                  saveAmount={saveAmount}
                  className="mt-4"
                />

                <CoupangDisclosure locale={locale} />

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
                locale={locale}
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
      </DictionaryProvider>
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
}
