import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { parseIngredientDetail } from "@/entities/ingredient/lib/parseIngredientDetail";
import { getIngredientDetailOnServer } from "@/entities/ingredient/model/api.server";
import { ingredientRecipesQueryKey } from "@/entities/ingredient/model/hooks";

import { IngredientDetailPageClient } from "@/widgets/IngredientDetailPage";

type IngredientDetailPageProps = {
  params: Promise<{ ingredientId: string }>;
};

const IngredientDetailPage = async ({ params }: IngredientDetailPageProps) => {
  const { ingredientId } = await params;

  const apiResponse = await getIngredientDetailOnServer(ingredientId);

  if (!apiResponse) {
    notFound();
  }

  const detail = parseIngredientDetail(apiResponse);

  const queryClient = new QueryClient();
  queryClient.setQueryData(ingredientRecipesQueryKey(ingredientId), {
    content: apiResponse.recipes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IngredientDetailPageClient detail={detail} />
    </HydrationBoundary>
  );
};

export default IngredientDetailPage;
