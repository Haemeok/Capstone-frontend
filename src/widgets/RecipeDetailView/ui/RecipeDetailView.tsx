import { InArticleAdSlot } from "@/shared/adsense/InArticleAdSlot";
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { isAiRecipe, isYoutubeRecipe } from "@/entities/recipe";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { ChatLauncher } from "@/features/recipe-chat";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";

import { CoupangDisclosure } from "./CoupangDisclosure";
import LazyRecommendedRecipeSlide from "./LazyRecommendedRecipeSlide";
import LazyRemixesSlide from "./LazyRemixesSlide";
import { NotTranslatedBanner } from "./NotTranslatedBanner";
import RecentlyViewedTracker from "./RecentlyViewedTracker";
import RecipeCommentsSection from "./RecipeCommentsSection";
import RecipeComponentsSection from "./RecipeComponentsSection";
import { RecipeContainer } from "./RecipeContainer";
import RecipeCookingInfoSection from "./RecipeCookingInfoSection";
import RecipeCookingTipsSection from "./RecipeCookingTipsSection";
import RecipeHeroSection from "./RecipeHeroSection";
import RecipeInfoSection from "./RecipeInfoSection";
import RecipeIngredientsSection from "./RecipeIngredientsSection";
import RecipeInteractionBar from "./RecipeInteractionBar";
import RecipeNavbar from "./RecipeNavbar";
import RecipePlatingSection from "./RecipePlatingSection";
import RecipeTagsSection from "./RecipeTagsSection";
import RecipeVideoSection from "./RecipeVideoSection";

type RecipeDetailViewProps = {
  recipe: StaticRecipe;
  recipeId: string;
  locale: "ko" | "ja";
  notTranslatedMessage?: string;
};

export const RecipeDetailView = ({
  recipe,
  recipeId,
  locale,
  notTranslatedMessage,
}: RecipeDetailViewProps) => {
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
    <>
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
          {notTranslatedMessage && (
            <NotTranslatedBanner message={notTranslatedMessage} />
          )}

          <RecipeInfoSection
            title={recipe.title}
            aiGenerated={isAiRecipe(recipe)}
            author={recipe.author}
            description={recipe.description}
            extractorId={recipe.extractorId}
            creatorCountryTag={recipe.creatorCountryTag}
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

              <InArticleAdSlot index={1} />

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

          <LazyRecommendedRecipeSlide
            recipeId={recipeId}
            tags={recipe.tags}
            locale={locale}
          />

          <LazyRemixesSlide recipeId={recipeId} locale={locale} />
        </RecipeContainer>
        <ChatLauncher recipeId={recipeId} />
      </RecipeStatusProvider>
    </>
  );
};
