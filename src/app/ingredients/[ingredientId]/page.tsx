import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  generateIngredientJsonLd,
  generateIngredientMetadata,
  generateNotFoundIngredientMetadata,
} from "@/entities/ingredient/lib/metadata";
import { parseIngredientDetail } from "@/entities/ingredient/lib/parseIngredientDetail";
import { getIngredientDetailOnServer } from "@/entities/ingredient/model/api.server";
import { ingredientRecipesQueryKey } from "@/entities/ingredient/model/hooks";

import { IngredientDetailPageClient } from "@/widgets/IngredientDetailPage";

type IngredientDetailPageProps = {
  params: Promise<{ ingredientId: string }>;
};

export const generateMetadata = async ({
  params,
}: IngredientDetailPageProps): Promise<Metadata> => {
  const { ingredientId } = await params;
  const apiResponse = await getIngredientDetailOnServer(ingredientId);
  if (!apiResponse) return generateNotFoundIngredientMetadata();

  const detail = parseIngredientDetail(apiResponse);
  return generateIngredientMetadata(detail, apiResponse.recipes.length);
};

const IngredientDetailPage = async ({ params }: IngredientDetailPageProps) => {
  const { ingredientId } = await params;

  const apiResponse = await getIngredientDetailOnServer(ingredientId);

  if (!apiResponse) {
    notFound();
  }

  const detail = parseIngredientDetail(apiResponse);
  const jsonLd = generateIngredientJsonLd(detail, apiResponse.recipes);

  const queryClient = new QueryClient();
  queryClient.setQueryData(ingredientRecipesQueryKey(ingredientId), {
    content: apiResponse.recipes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <IngredientDetailPageClient detail={detail} />
    </HydrationBoundary>
  );
};

export default IngredientDetailPage;
