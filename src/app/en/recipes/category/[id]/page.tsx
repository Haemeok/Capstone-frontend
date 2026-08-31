import { Metadata } from "next";

import { buildCategoryMetadata } from "@/app/recipes/category/[id]/categoryMetadata";
import {
  type CategorySearchParams,
  parseCategoryPage,
} from "@/app/recipes/category/[id]/categoryPagination";
import { getCategoryTagCodeOrNotFound } from "@/app/recipes/category/[id]/categoryRoute";
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
  const tagCode = getCategoryTagCodeOrNotFound(id);
  const rawSearchParams = await searchParams;
  const { publicPage } = parseCategoryPage(rawSearchParams.page);

  return buildCategoryMetadata({ id: tagCode, publicPage, locale: "en" });
}

export default async function EnCategoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const tagCode = getCategoryTagCodeOrNotFound(id);

  return renderCategoryPage({
    tagCode,
    searchParams: await searchParams,
    locale: "en",
  });
}
