import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { BASE_API_URL } from "@/shared/config/constants/api";

import { getrecipionServer } from "@/entities/recipe/model/api.server";
import { RecipeStatus } from "@/entities/recipe/model/types";
import { User } from "@/entities/user";

import { RecipeRemixForm } from "@/features/recipe-create/ui/RecipeRemixForm";

type RemixPageProps = {
  params: Promise<{ recipeId: string }>;
};

const getMeOnServer = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(`${BASE_API_URL}/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

const getRecipeStatusOnServer = async (
  recipeId: string
): Promise<RecipeStatus | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(
      `${BASE_API_URL}/v2/recipes/${recipeId}/status`,
      {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

const RemixPage = async ({ params }: RemixPageProps) => {
  const { recipeId } = await params;

  // (A) 비로그인 체크 — detail fetch 전에 먼저 확인
  const me = await getMeOnServer();
  if (!me) {
    redirect(`/login?next=/recipes/${recipeId}/remix`);
  }

  // (B) recipe detail + status 병렬 fetch
  const [recipe, recipeStatus] = await Promise.all([
    getrecipionServer(recipeId),
    getRecipeStatusOnServer(recipeId),
  ]);

  if (!recipe) {
    redirect(`/recipes/${recipeId}`);
  }

  // (C) 가드 2: 본인 레시피 → edit으로
  const isOwner = recipe.author.id === me.id;
  if (isOwner) {
    redirect(`/recipes/${recipeId}/edit`);
  }

  // (D) 가드 3: 클론 불가 → 상세 페이지 + error param
  if (!recipe.isCloneable) {
    redirect(`/recipes/${recipeId}?error=not-cloneable`);
  }

  // (E) 가드 4: 이미 클론함 → 상세 페이지 + error param
  if (recipeStatus?.clonedByMe) {
    redirect(`/recipes/${recipeId}?error=already-cloned`);
  }

  // (F) Prefetch + HydrationBoundary
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getrecipionServer(recipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeRemixForm recipeId={recipeId} />
    </HydrationBoundary>
  );
};

export default RemixPage;
