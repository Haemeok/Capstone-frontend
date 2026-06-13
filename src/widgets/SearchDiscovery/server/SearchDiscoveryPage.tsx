import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import SearchDiscoveryClient from "@/widgets/SearchDiscovery/SearchDiscoveryClient";

export const searchDiscoveryMetadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
  robots: { index: false, follow: true },
};

type Props = { focused: boolean };

export const SearchDiscoveryPage = async ({ focused }: Props) => {
  const queryClient = new QueryClient();

  if (!focused) {
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
        <SearchDiscoveryClient focused={focused} />
      </HydrationBoundary>
    </Suspense>
  );
};
