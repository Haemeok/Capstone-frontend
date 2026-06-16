import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot } from "@/shared/adsense/BottomAnchorAdSlot";
import type { Locale } from "@/shared/i18n";
import { ScrollReset } from "@/shared/ui/ScrollReset";

import { isPrivateRecipe } from "@/entities/recipe";
import { getPrivateRecipeOnServer } from "@/entities/recipe/model/api.server";

import { SmartAppBanner } from "@/features/smart-app-banner";

import { RecipeDetailView } from "@/widgets/RecipeDetailView/ui/RecipeDetailView";

export const privateRecipeMetadata: Metadata = {
  robots: { index: false, follow: false },
};

export const PrivateRecipePage = async ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: Locale;
}) => {
  const recipe = await getPrivateRecipeOnServer(recipeId, locale);

  if (!recipe || !isPrivateRecipe(recipe)) {
    notFound();
  }

  return (
    <ScrollReset>
      <RecipeDetailView
        recipe={recipe as Parameters<typeof RecipeDetailView>[0]["recipe"]} // Recipe ⊇ StaticRecipe
        recipeId={recipeId}
        locale={locale}
      />
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
};
