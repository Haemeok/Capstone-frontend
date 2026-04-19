import { Suspense } from "react";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import { SearchDiscoveryClient } from "@/widgets/SearchDiscovery";

export const metadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
};

type SearchPageProps = {
  searchParams: Promise<{ focused?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { focused } = await searchParams;
  const isFocused = focused === "1";

  const latestRecipes = isFocused
    ? []
    : (await getRecipesOnServer({ key: "search", page: 0, sort: "createdAt,desc" })).content;

  return (
    <Suspense>
      <SearchDiscoveryClient
        focused={isFocused}
        latestRecipes={latestRecipes}
      />
    </Suspense>
  );
}
