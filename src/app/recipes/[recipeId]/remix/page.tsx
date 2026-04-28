import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  getRecipeStatusOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";
import { getMeOnServer } from "@/entities/user/model/api.server";

import { RecipeRemixForm } from "@/features/recipe-create/ui/RecipeRemixForm";

import { REMIX_REDIRECT_ERRORS } from "../lib/remixRedirectErrors";

type RemixPageProps = {
  params: Promise<{ recipeId: string }>;
};

const RemixPage = async ({ params }: RemixPageProps) => {
  const { recipeId } = await params;

  // (A) 비로그인 체크 — detail fetch 전에 먼저 확인
  const me = await getMeOnServer();
  if (!me) {
    redirect(`/login?from=/recipes/${recipeId}/remix`);
  }

  // (B) recipe detail + status 병렬 fetch
  // isCloneable은 V2 detail static에만 포함되므로 V2 endpoint 사용
  const [recipe, recipeStatus] = await Promise.all([
    getStaticrecipionServer(recipeId),
    getRecipeStatusOnServer(recipeId),
  ]);

  if (!recipe) {
    notFound();
  }

  // (C) 가드 2: 본인 레시피 → edit으로
  const isOwner = recipe.author.id === me.id;
  if (isOwner) {
    redirect(`/recipes/${recipeId}/edit`);
  }

  // (D) 가드 3: 클론 불가 → 상세 페이지 + error param
  if (!recipe.isCloneable) {
    redirect(
      `/recipes/${recipeId}?error=${REMIX_REDIRECT_ERRORS.NOT_CLONEABLE}`
    );
  }

  // (E) 가드 4: 이미 클론함 → 상세 페이지 + error param
  if (recipeStatus?.clonedByMe) {
    redirect(
      `/recipes/${recipeId}?error=${REMIX_REDIRECT_ERRORS.ALREADY_CLONED}`
    );
  }

  // (F) Prefetch + HydrationBoundary
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getStaticrecipionServer(recipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeRemixForm recipeId={recipeId} />
    </HydrationBoundary>
  );
};

export default RemixPage;
