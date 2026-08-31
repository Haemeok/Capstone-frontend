import { Metadata } from "next";

import { buildCategoryMetadata } from "./categoryMetadata";
import type { CategorySearchParams } from "./categoryPagination";
import { parseCategoryPage } from "./categoryPagination";
import { getCategoryTagCodeOrNotFound } from "./categoryRoute";
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
  const tagCode = getCategoryTagCodeOrNotFound(id);
  const rawSearchParams = await searchParams;
  const { publicPage } = parseCategoryPage(rawSearchParams.page);

  return buildCategoryMetadata({ id: tagCode, publicPage, locale: "ko" });
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const tagCode = getCategoryTagCodeOrNotFound(id);

  return renderCategoryPage({
    tagCode,
    searchParams: await searchParams,
    locale: "ko",
  });
}
