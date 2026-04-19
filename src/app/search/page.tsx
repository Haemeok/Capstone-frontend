import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPageParam } from "@/shared/lib/utils";

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

  const queryClient = new QueryClient();

  if (!isFocused) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["recipes", "latest"],
      queryFn: () =>
        getRecipesOnServer({ key: "search", page: 0, sort: "createdAt,desc" }),
      initialPageParam: 0,
      getNextPageParam,
      pages: 1,
    });
  }

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchDiscoveryClient focused={isFocused} />
      </HydrationBoundary>
    </Suspense>
  );
}
