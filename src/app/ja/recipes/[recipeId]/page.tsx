import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot } from "@/shared/adsense/BottomAnchorAdSlot";
import { ScrollReset } from "@/shared/ui/ScrollReset";

import {
  generateLocalizedRecipeJsonLd,
  generateLocalizedRecipeMetadata,
  generateNotFoundRecipeMetadata,
} from "@/entities/recipe/lib/metadata";
import {
  getLocalizedRecipeOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";

import { SmartAppBanner } from "@/features/smart-app-banner";

import { RecipeDetailView } from "@/widgets/RecipeDetailView";

type JaRecipeDetailPageProps = {
  params: Promise<{ recipeId: string }>;
};

export async function generateMetadata({
  params,
}: JaRecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const result = await getLocalizedRecipeOnServer(recipeId, "ja");

  if (result.kind === "ok") {
    return generateLocalizedRecipeMetadata(result.recipe, recipeId, {
      locale: "ja",
      translated: true,
    });
  }

  if (result.kind === "notTranslated") {
    const ko = await getStaticrecipionServer(recipeId);
    if (!ko) return generateNotFoundRecipeMetadata();
    return generateLocalizedRecipeMetadata(ko, recipeId, {
      locale: "ja",
      translated: false,
    });
  }

  return generateNotFoundRecipeMetadata();
}

export default async function JaRecipeDetailPage({
  params,
}: JaRecipeDetailPageProps) {
  const { recipeId } = await params;
  const result = await getLocalizedRecipeOnServer(recipeId, "ja");

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

  const notTranslatedMessage =
    result.kind === "notTranslated" ? result.message : undefined;

  const jsonLd =
    result.kind === "ok"
      ? generateLocalizedRecipeJsonLd(recipe, recipeId, "ja")
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
        locale="ja"
        notTranslatedMessage={notTranslatedMessage}
      />
      <BottomAnchorAdSlot />
      <SmartAppBanner />
    </ScrollReset>
  );
}
