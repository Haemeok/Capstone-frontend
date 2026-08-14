import { Metadata } from "next";

import type { TagCode } from "@/shared/config/constants/recipe";

import { buildCategoryMetadata } from "./categoryMetadata";
import type { CategorySearchParams } from "./categoryPagination";
import { parseCategoryPage } from "./categoryPagination";
import { renderCategoryPage } from "./renderCategoryPage";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<CategorySearchParams>;
};

export function generateStaticParams() {
  return [{ id: "CHEF_RECIPE" }];
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const rawSearchParams = await searchParams;
  const { publicPage } = parseCategoryPage(rawSearchParams.page);

  return buildCategoryMetadata({ id, publicPage, locale: "ko" });
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;

  return renderCategoryPage({
    // Dynamic category route narrows at the renderer boundary.
    tagCode: id as TagCode,
    searchParams: await searchParams,
    locale: "ko",
  });
}
