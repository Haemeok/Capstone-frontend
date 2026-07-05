import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot } from "@/shared/adsense/BottomAnchorAdSlot";
import type { TranslatedLocale } from "@/shared/i18n";
import { ScrollReset } from "@/shared/ui/ScrollReset";

import {
  generateLocalizedRecipeJsonLd,
  generateLocalizedRecipeMetadata,
  generateNotFoundRecipeMetadata,
} from "@/entities/recipe/lib/metadata";
import {
  applyIndexedRenderPolicy,
  renderDynamic,
} from "@/entities/recipe/lib/renderPolicy";
import {
  getLocalizedRecipeOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";

import { SmartAppBanner } from "@/features/smart-app-banner";

import { RecipeDetailView } from "@/widgets/RecipeDetailView/ui/RecipeDetailView";

export const buildLocalizedRecipeMetadata = async ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: TranslatedLocale;
}): Promise<Metadata> => {
  const result = await getLocalizedRecipeOnServer(recipeId, locale);

  if (result.kind === "ok") {
    return generateLocalizedRecipeMetadata(result.recipe, recipeId, {
      locale,
      translated: true,
    });
  }

  if (result.kind === "notTranslated") {
    const ko = await getStaticrecipionServer(recipeId);
    if (!ko) return generateNotFoundRecipeMetadata();
    return generateLocalizedRecipeMetadata(ko, recipeId, {
      locale,
      translated: false,
    });
  }

  return generateNotFoundRecipeMetadata();
};

export const LocalizedRecipePage = async ({
  recipeId,
  locale,
  bottomSlides,
}: {
  recipeId: string;
  locale: TranslatedLocale;
  bottomSlides?: ReactNode;
}) => {
  const result = await getLocalizedRecipeOnServer(recipeId, locale);

  if (result.kind === "notFound") {
    notFound();
  }

  const recipe =
    result.kind === "ok"
      ? result.recipe
      : await getStaticrecipionServer(recipeId);

  if (!recipe) {
    notFound();
  }

  if (result.kind === "ok") {
    await applyIndexedRenderPolicy(recipe.isIndexed);
  } else {
    await renderDynamic();
  }

  const notTranslatedMessage =
    result.kind === "notTranslated" ? result.message : undefined;

  const jsonLd =
    result.kind === "ok"
      ? generateLocalizedRecipeJsonLd(recipe, recipeId, locale)
      : null;

  return (
    <ScrollReset>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <RecipeDetailView
        recipe={recipe}
        recipeId={recipeId}
        locale={locale}
        notTranslatedMessage={notTranslatedMessage}
        bottomSlides={bottomSlides}
      />
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
};
