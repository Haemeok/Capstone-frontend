import { Metadata } from "next";

import { buildCategoryMetadata } from "@/app/recipes/category/[id]/categoryMetadata";
import { renderCategoryPage } from "@/app/recipes/category/[id]/renderCategoryPage";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const page = Math.max(0, parseInt(awaitedSearchParams.page || "0", 10) || 0);

  return buildCategoryMetadata({ id, page, locale: "ja" });
}

export default async function JaCategoryPage({ params, searchParams }: Props) {
  const { id: tagCode } = await params;
  const awaitedSearchParams = await searchParams;

  return renderCategoryPage({
    tagCode,
    searchParams: awaitedSearchParams,
    locale: "ja",
  });
}
