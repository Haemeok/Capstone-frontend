import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getRecipeStatusPublicOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";

import { fetchCurationArticle, toSavedRecord } from "@/features/curation";
import { CurationArticle } from "@/features/curation/ui/CurationArticle";

const cachedGet = cache(fetchCurationArticle);

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) return {};
  return {
    title: data.title,
    description: data.description ?? undefined,
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) notFound();

  // /v2/recipes/${id}는 favoriteCount를 안 채워주므로 status 엔드포인트에서 카운트만 빌려와 머지.
  const recipes = await Promise.all(
    data.recipeIds.map(async (id) => {
      const [recipe, status] = await Promise.all([
        getStaticrecipionServer(id),
        getRecipeStatusPublicOnServer(id),
      ]);
      if (!recipe) return null;
      return {
        ...recipe,
        favoriteCount: status?.favoriteCount ?? recipe.favoriteCount,
      };
    }),
  );

  const record = toSavedRecord(data, recipes);
  return <CurationArticle data={record} recipes={recipes} />;
};

export default Page;
