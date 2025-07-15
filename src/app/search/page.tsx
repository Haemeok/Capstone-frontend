import { getRecipesOnServer } from "@/entities/recipe/model/api";
import { SearchClient } from "@/widgets/SearchClient";
import type { Metadata } from "next";

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

// 2. 페이지는 서버 컴포넌트로, searchParams를 받습니다.
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // 3. 서버에서 URL 쿼리 파라미터를 사용해 초기 데이터를 가져옵니다.
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

  return (
    // 4. 모든 상호작용은 클라이언트 컴포넌트에 위임하고, 서버에서 가져온 데이터를 전달합니다.
    <SearchClient initialRecipes={initialRecipes} />
  );
}
