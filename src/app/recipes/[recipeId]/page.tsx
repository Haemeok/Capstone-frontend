import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot, InArticleAdSlot } from "@/shared/adsense";
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import {
  generateNotFoundRecipeMetadata,
  generateRecipeJsonLd,
  generateRecipeMetadata,
} from "@/entities/recipe/lib/metadata";
import {
  getStaticRecipesOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

import { ChatLauncher } from "@/features/recipe-chat";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { RecipeStatusProvider } from "@/features/recipe-status";
import { SmartAppBanner } from "@/features/smart-app-banner";

import { CoupangDisclosure } from "./components/CoupangDisclosure";
import LazyRecommendedRecipeSlide from "./components/LazyRecommendedRecipeSlide";
import RecentlyViewedTracker from "./components/RecentlyViewedTracker";
import RecipeCommentsSection from "./components/RecipeCommentsSection";
import RecipeComponentsSection from "./components/RecipeComponentsSection";
import { RecipeContainer } from "./components/RecipeContainer";
import RecipeCookingInfoSection from "./components/RecipeCookingInfoSection";
import RecipeCookingTipsSection from "./components/RecipeCookingTipsSection";
import RecipeHeroSection from "./components/RecipeHeroSection";
import RecipeInfoSection from "./components/RecipeInfoSection";
import RecipeIngredientsSection from "./components/RecipeIngredientsSection";
import RecipeInteractionBar from "./components/RecipeInteractionBar";
import RecipeNavbar from "./components/RecipeNavbar";
import RecipePlatingSection from "./components/RecipePlatingSection";
import RecipeTagsSection from "./components/RecipeTagsSection";
import RecipeVideoSection from "./components/RecipeVideoSection";
import { ScrollReset } from "./components/ScrollReset";
import { RemixRedirectToast } from "./RemixRedirectToast";

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

  const staticRecipe = await getStaticrecipionServer(recipeId);

  if (!staticRecipe) {
    notFound();
  }

  const saveAmount =
    staticRecipe.marketPrice - staticRecipe.totalIngredientCost;

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

  const jsonLd = generateRecipeJsonLd(staticRecipe, recipeId);

  return (
    <ScrollReset>
      <Suspense fallback={null}>
        <RemixRedirectToast />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
        youtubeChannelName={staticRecipe.youtubeChannelName}
        isAiGenerated={staticRecipe.aiGenerated}
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

          <ErrorBoundary
            fallback={
              <SectionErrorFallback message="비디오를 불러올 수 없어요" />
            }
          >
            <RecipeVideoSection
              videoUrl={staticRecipe.youtubeUrl ?? ""}
              youtubeMetadata={youtubeMetadata}
            >
              <InArticleAdSlot className="my-6" />

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="댓글을 불러올 수 없어요" />
                }
              >
                <RecipeCommentsSection comments={staticRecipe.comments} />
              </ErrorBoundary>

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="재료 정보를 불러올 수 없어요" />
                }
              >
                <RecipeIngredientsSection recipe={staticRecipe} />
              </ErrorBoundary>

              <RecipeCompleteButton saveAmount={saveAmount} className="mt-4" />

              <CoupangDisclosure />

              {staticRecipe.fineDiningInfo?.components && (
                <RecipeComponentsSection
                  components={staticRecipe.fineDiningInfo.components}
                />
              )}

              <RecipeCookingTipsSection
                tips={staticRecipe.cookingTips}
                headerExtra={<CookingUnitTooltip inline />}
              />

              <ErrorBoundary
                fallback={
                  <SectionErrorFallback message="조리 순서를 불러올 수 없어요" />
                }
              >
                <RecipeStepList
                  RecipeSteps={staticRecipe.steps}
                  recipeIngredients={staticRecipe.ingredients}
                />
              </ErrorBoundary>
            </RecipeVideoSection>
          </ErrorBoundary>

          {staticRecipe.fineDiningInfo?.plating && (
            <RecipePlatingSection
              vessel={staticRecipe.fineDiningInfo.plating.vessel}
              guide={staticRecipe.fineDiningInfo.plating.guide}
            />
          )}

          <RecipeTagsSection tags={staticRecipe.tags} />

          <LazyRecommendedRecipeSlide
            recipeId={recipeId}
            tags={staticRecipe.tags}
          />
        </RecipeContainer>
        <ChatLauncher recipeId={recipeId} />
      </RecipeStatusProvider>
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
}
