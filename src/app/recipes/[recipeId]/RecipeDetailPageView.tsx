import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot } from "@/shared/adsense/BottomAnchorAdSlot";
import { ScrollReset } from "@/shared/ui/ScrollReset";

import { isPrivateRecipe } from "@/entities/recipe";
import {
  generateNotFoundRecipeMetadata,
  generateRecipeJsonLd,
  generateRecipeMetadata,
} from "@/entities/recipe/lib/metadata";
import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";

import { SmartAppBanner } from "@/features/smart-app-banner";

import { RecipeDetailView } from "@/widgets/RecipeDetailView";
import RecipeCoupangProducts from "@/widgets/RecipeDetailView/server/RecipeCoupangProducts";
import { RecipeDetailServerSlides } from "@/widgets/RecipeSlide/server";

import { RemixRedirectToast } from "./RemixRedirectToast";

export const buildRecipeMetadata = async (
  recipeId: string
): Promise<Metadata> => {
  const staticRecipe = await getStaticrecipionServer(recipeId);

  if (!staticRecipe || isPrivateRecipe(staticRecipe))
    return generateNotFoundRecipeMetadata();

  return generateRecipeMetadata(staticRecipe, recipeId);
};

export const RecipeDetailPageView = async ({
  recipeId,
}: {
  recipeId: string;
}) => {
  const staticRecipe = await getStaticrecipionServer(recipeId);

  if (!staticRecipe || isPrivateRecipe(staticRecipe)) {
    notFound();
  }

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
      <RecipeDetailView
        recipe={staticRecipe}
        recipeId={recipeId}
        locale="ko"
        bottomSlides={
          <RecipeDetailServerSlides recipeId={recipeId} locale="ko" />
        }
        ingredientShopping={
          <Suspense fallback={null}>
            <RecipeCoupangProducts
              recipeId={recipeId}
              isIndexed={staticRecipe.isIndexed}
            />
          </Suspense>
        }
      />
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
};
