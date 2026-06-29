import type { Locale } from "@/shared/i18n";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryDetailClient from "./CategoryDetailClient";

type RenderCategoryPageArgs = {
  tagCode: string;
  searchParams: { page?: string };
  locale: Locale;
};

export const renderCategoryPage = async ({
  tagCode,
  searchParams,
  locale,
}: RenderCategoryPageArgs) => {
  const page = Math.max(0, parseInt(searchParams.page || "0", 10) || 0);

  const pageData = await getRecipesOnServer({
    key: "search",
    page,
    tags: [tagCode],
    types: ["USER", "AI", "YOUTUBE"],
    ...(locale === "ko" ? {} : { lang: locale }),
  });

  const hasNextPage = pageData.slice.hasNext;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(searchParams, page + 1, `/recipes/category/${tagCode}`)
    : undefined;

  return (
    <CategoryDetailClient initialPage={page} nextPageHref={nextPageHref} />
  );
};
