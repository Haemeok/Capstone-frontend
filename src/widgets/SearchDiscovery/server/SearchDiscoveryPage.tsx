import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";
import { getNextSlicePageParam } from "@/shared/lib/utils";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import CookedPopularServerSlide from "@/widgets/RecipeSlide/server/CookedPopularServerSlide";
import SearchDiscoveryClient from "@/widgets/SearchDiscovery/SearchDiscoveryClient";
import { SearchDiscoverySkeleton } from "@/widgets/SearchDiscovery/ui/SearchDiscoverySkeleton";

export const searchDiscoveryMetadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
  robots: { index: false, follow: true },
};

type Props = { focused: boolean; locale?: Locale };

const SearchDiscoveryData = async ({ locale }: { locale: Locale }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["recipes", "latest"],
    queryFn: () =>
      getRecipesOnServer({ key: "search", page: 0, sort: "createdAt,desc" }),
    initialPageParam: 0,
    getNextPageParam: getNextSlicePageParam,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchDiscoveryClient
        focused={false}
        cookedPopularSlot={<CookedPopularServerSlide locale={locale} />}
      />
    </HydrationBoundary>
  );
};

export const SearchDiscoveryPage = ({ focused, locale = "ko" }: Props) => {
  if (focused) {
    return <SearchDiscoveryClient focused />;
  }

  return (
    <Suspense fallback={<SearchDiscoverySkeleton />}>
      <SearchDiscoveryData locale={locale} />
    </Suspense>
  );
};
