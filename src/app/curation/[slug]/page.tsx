import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";

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

  const recipes = await Promise.all(
    data.recipeIds.map((id) => getStaticrecipionServer(id)),
  );

  const record = toSavedRecord(data, recipes);
  return <CurationArticle data={record} recipes={recipes} />;
};

export default Page;
