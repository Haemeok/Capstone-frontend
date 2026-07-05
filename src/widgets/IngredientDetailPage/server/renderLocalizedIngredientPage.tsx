import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import type { TranslatedLocale } from "@/shared/i18n";

import {
  generateLocalizedIngredientJsonLd,
  generateLocalizedIngredientMetadata,
  generateNotFoundIngredientMetadata,
} from "@/entities/ingredient/lib/metadata";
import { parseIngredientDetail } from "@/entities/ingredient/lib/parseIngredientDetail";
import {
  getIngredientDetailOnServer,
  getLocalizedIngredientOnServer,
} from "@/entities/ingredient/model/api.server";
import { ingredientRecipesQueryKey } from "@/entities/ingredient/model/hooks";

import IngredientDetailPageClient from "@/widgets/IngredientDetailPage/IngredientDetailPageClient";

export const buildLocalizedIngredientMetadata = async ({
  ingredientId,
  locale,
}: {
  ingredientId: string;
  locale: TranslatedLocale;
}): Promise<Metadata> => {
  const result = await getLocalizedIngredientOnServer(ingredientId, locale);

  if (result.kind === "ok") {
    const detail = parseIngredientDetail(result.detail);
    return generateLocalizedIngredientMetadata(
      detail,
      result.detail.recipes.length,
      { locale, translated: true }
    );
  }

  if (result.kind === "notTranslated") {
    const ko = await getIngredientDetailOnServer(ingredientId);
    if (!ko) return generateNotFoundIngredientMetadata();
    return generateLocalizedIngredientMetadata(
      parseIngredientDetail(ko),
      ko.recipes.length,
      { locale, translated: false }
    );
  }

  return generateNotFoundIngredientMetadata();
};

export const LocalizedIngredientPage = async ({
  ingredientId,
  locale,
}: {
  ingredientId: string;
  locale: TranslatedLocale;
}) => {
  const result = await getLocalizedIngredientOnServer(ingredientId, locale);

  if (result.kind === "notFound") {
    notFound();
  }

  const apiResponse =
    result.kind === "ok"
      ? result.detail
      : await getIngredientDetailOnServer(ingredientId);

  if (!apiResponse) {
    notFound();
  }

  const detail = parseIngredientDetail(apiResponse);
  const translated = result.kind === "ok";
  const jsonLd = translated
    ? generateLocalizedIngredientJsonLd(detail, apiResponse.recipes, locale)
    : null;

  const queryClient = new QueryClient();
  queryClient.setQueryData(ingredientRecipesQueryKey(ingredientId, locale), {
    content: apiResponse.recipes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <IngredientDetailPageClient detail={detail} locale={locale} />
    </HydrationBoundary>
  );
};
