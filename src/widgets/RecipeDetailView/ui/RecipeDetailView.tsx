import type { ReactNode } from "react";

import { InArticleAdSlot } from "@/shared/adsense/InArticleAdSlot";
import { RecipeStepAdSlot } from "@/shared/adsense/RecipeStepAdSlot";
import { DictionaryProvider, getDictionary, type Locale } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { Reveal } from "@/shared/ui/Reveal";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { isAiRecipe, isYoutubeRecipe } from "@/entities/recipe";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { ChatLauncher } from "@/features/recipe-chat";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";

import { CoupangDisclosure } from "./CoupangDisclosure";
import { NotTranslatedBanner } from "./NotTranslatedBanner";
import RecentlyViewedTracker from "./RecentlyViewedTracker";
import RecipeCommentsSection from "./RecipeCommentsSection";
import RecipeComponentsSection from "./RecipeComponentsSection";
import { RecipeContainer } from "./RecipeContainer";
import RecipeCookingHelpButton from "./RecipeCookingHelpButton";
import RecipeCookingInfoSection from "./RecipeCookingInfoSection";
import { RecipeDetailBottomSlides } from "./RecipeDetailBottomSlides";
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
  bottomSlides?: ReactNode;
  ingredientShopping?: ReactNode;
};

export const RecipeDetailView = ({
  recipe,
  recipeId,
  locale,
  notTranslatedMessage,
  bottomSlides,
  ingredientShopping,
}: RecipeDetailViewProps) => {
  const t = getDictionary(locale);
  const saveAmount = recipe.marketPrice - recipe.totalIngredientCost;

  const youtubeMetadata = recipe.youtube?.channelName
    ? {
        channelName: recipe.youtube.channelName,
        videoTitle: recipe.youtube.videoTitle,
        channelProfileUrl: recipe.youtube.channelProfileUrl,
        subscriberCount: recipe.youtube.subscriberCount,
        thumbnailUrl: recipe.youtube.thumbnailUrl,
        channelId: recipe.youtube.channelId,
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
        youtubeChannelName={recipe.youtube?.channelName}
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

          <div className="rise-in rise-d3">
            <RecipeCookingInfoSection
              cookingTime={recipe.cookingTime}
              cookingTools={recipe.cookingTools}
              servings={recipe.servings}
              locale={locale}
            />
          </div>

          <ErrorBoundary
            fallback={<SectionErrorFallback message={t.errors.video} />}
          >
            <RecipeVideoSection
              videoUrl={recipe.youtube?.url ?? ""}
              youtubeMetadata={youtubeMetadata}
              locale={locale}
            >
              <InArticleAdSlot />

              <Reveal className="reveal-subtle">
                <ErrorBoundary
                  fallback={
                    <SectionErrorFallback message={t.errors.comments} />
                  }
                >
                  <RecipeCommentsSection
                    comments={recipe.comments}
                    locale={locale}
                  />
                </ErrorBoundary>
              </Reveal>

              <Reveal className="reveal-subtle">
                <ErrorBoundary
                  fallback={
                    <SectionErrorFallback message={t.errors.ingredients} />
                  }
                >
                  <RecipeIngredientsSection recipe={recipe} locale={locale} />
                </ErrorBoundary>
              </Reveal>

              {ingredientShopping}

              <CoupangDisclosure locale={locale} />

              <Reveal className="reveal-subtle">
                <RecipeCompleteButton saveAmount={saveAmount} locale={locale} />
              </Reveal>

              {recipe.fineDiningInfo?.components && (
                <Reveal className="reveal-subtle">
                  <RecipeComponentsSection
                    components={recipe.fineDiningInfo.components}
                  />
                </Reveal>
              )}

              <Reveal className="reveal-subtle">
                <RecipeCookingHelpButton tips={recipe.cookingTips} />
              </Reveal>

              <InArticleAdSlot index={1} />

              <Reveal className="reveal-subtle">
                <ErrorBoundary
                  fallback={<SectionErrorFallback message={t.errors.steps} />}
                >
                  <RecipeStepList
                    RecipeSteps={recipe.steps}
                    recipeIngredients={recipe.ingredients}
                    midSlot={<RecipeStepAdSlot />}
                  />
                </ErrorBoundary>
              </Reveal>
            </RecipeVideoSection>
          </ErrorBoundary>

          {recipe.fineDiningInfo?.plating && (
            <Reveal className="reveal-subtle">
              <RecipePlatingSection
                vessel={recipe.fineDiningInfo.plating.vessel}
                guide={recipe.fineDiningInfo.plating.guide}
                locale={locale}
              />
            </Reveal>
          )}

          <Reveal className="reveal-subtle">
            <RecipeTagsSection tags={recipe.tags} />
          </Reveal>

          <Reveal className="reveal-subtle">
            <RecipeDetailBottomSlides
              recipeId={recipeId}
              tags={recipe.tags}
              locale={locale}
            />
          </Reveal>
          {bottomSlides}
        </RecipeContainer>
        {locale === "ko" && <ChatLauncher recipeId={recipeId} />}
      </RecipeStatusProvider>
    </DictionaryProvider>
  );
};
