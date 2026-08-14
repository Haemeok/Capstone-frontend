import { Metadata } from "next";

import type { TagCode } from "@/shared/config/constants/recipe";

import { buildCategoryMetadata } from "@/app/recipes/category/[id]/categoryMetadata";
import {
  type CategorySearchParams,
  parseCategoryPage,
} from "@/app/recipes/category/[id]/categoryPagination";
import { renderCategoryPage } from "@/app/recipes/category/[id]/renderCategoryPage";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<CategorySearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const rawSearchParams = await searchParams;
  const { publicPage } = parseCategoryPage(rawSearchParams.page);

  return buildCategoryMetadata({ id, publicPage, locale: "en" });
}

export default async function EnCategoryPage({ params, searchParams }: Props) {
  const { id } = await params;

  return renderCategoryPage({
    // Dynamic category route narrows at the renderer boundary.
    tagCode: id as TagCode,
    searchParams: await searchParams,
    locale: "en",
  });
}
