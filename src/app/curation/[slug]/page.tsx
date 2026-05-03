import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getCurationLocal } from "@/app/actions/curationLocal";
import { getRecipe } from "@/entities/recipe/model/api";
import { CurationArticle } from "@/features/curation/ui/CurationArticle";

const cachedGet = cache(getCurationLocal);

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
    title: data.h1,
    description: data.dek,
    openGraph: {
      title: data.h1,
      description: data.dek,
      images: data.thumbnailUrl ? [{ url: data.thumbnailUrl }] : [],
    },
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) notFound();

  const recipes = await Promise.all(
    data.recipeIds.map((id) =>
      getRecipe(id).catch((e) => {
        console.error(`[curation] getRecipe(${id}) 실패:`, e);
        return null;
      }),
    ),
  );

  console.log(
    `[curation/${slug}] recipes fetch 결과:`,
    recipes.map((r, i) => ({
      idx: i,
      id: data.recipeIds[i],
      ok: r !== null,
      title: r?.title,
      hasIngredients: r?.ingredients?.length ?? 0,
      hasSteps: r?.steps?.length ?? 0,
      likeCount: r?.likeCount,
      ratingAvg: r?.ratingInfo?.avgRating,
      cookingTime: r?.cookingTime,
    })),
  );

  return <CurationArticle data={data} recipes={recipes} />;
};

export default Page;
