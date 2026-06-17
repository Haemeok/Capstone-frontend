import { InArticleAdSlot } from "@/shared/adsense/InArticleAdSlot";
import { RecipeStepAdSlot } from "@/shared/adsense/RecipeStepAdSlot";
import { DictionaryProvider, getDictionary, type Locale } from "@/shared/i18n";
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
  locale: Locale;
  notTranslatedMessage?: string;
};

export const RecipeDetailView = ({
  recipe,
  recipeId,
  locale,
  notTranslatedMessage,
}: RecipeDetailViewProps) => {
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
            fallback={<SectionErrorFallback message={t.errors.video} />}
          >
            <RecipeVideoSection
              videoUrl={recipe.youtubeUrl ?? ""}
              youtubeMetadata={youtubeMetadata}
              locale={locale}
            >
              <InArticleAdSlot />

              <ErrorBoundary
                fallback={<SectionErrorFallback message={t.errors.comments} />}
              >
                <RecipeCommentsSection
                  comments={recipe.comments}
                  locale={locale}
                />
              </ErrorBoundary>

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message={t.errors.ingredients} />
                }
              >
                <RecipeIngredientsSection recipe={recipe} locale={locale} />
              </ErrorBoundary>

              <RecipeCompleteButton
                saveAmount={saveAmount}
                locale={locale}
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

              <InArticleAdSlot index={1} />

              <ErrorBoundary
                fallback={<SectionErrorFallback message={t.errors.steps} />}
              >
                <RecipeStepList
                  RecipeSteps={recipe.steps}
                  recipeIngredients={recipe.ingredients}
                  midSlot={<RecipeStepAdSlot />}
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

          <LazyRecommendedRecipeSlide
            recipeId={recipeId}
            tags={recipe.tags}
            locale={locale}
          />

          <LazyRemixesSlide recipeId={recipeId} locale={locale} />
        </RecipeContainer>
        {locale === "ko" && <ChatLauncher recipeId={recipeId} />}
      </RecipeStatusProvider>
    </DictionaryProvider>
  );
};
