import type { Metadata } from "next";

import { getRecipesOnServer } from "@/entities/recipe/model/api";

import { SearchClient } from "@/widgets/SearchClient";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    dishType?: string;
    tagNames?: string | string[];
  }>;
};

// 1. URL 쿼리에 따라 동적으로 Metadata를 생성합니다.
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || "";
  if (query) {
    return {
      title: `${query} 검색 결과 - 해먹`,
      description: `"${query}"에 대한 레시피 검색 결과입니다.`,
    };
  }
  return {
    title: "레시피 검색 - 해먹",
    description: "원하는 레시피를 검색하고 찾아보세요.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const awaitedSearchParams = await searchParams;
  const tagNames = Array.isArray(awaitedSearchParams.tagNames)
    ? awaitedSearchParams.tagNames
    : awaitedSearchParams.tagNames
      ? [awaitedSearchParams.tagNames]
      : [];

  const initialRecipes = await getRecipesOnServer({
    key: "search",
    q: awaitedSearchParams.q,
    sort: awaitedSearchParams.sort?.toLowerCase() === "asc" ? "asc" : "desc", // DESC/ASC를 desc/asc로 변환
    dishType: awaitedSearchParams.dishType,
    tagNames,
  });

  return <SearchClient initialRecipes={initialRecipes} />;
}
