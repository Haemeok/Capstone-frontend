import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";
import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import CookedPopularServerSlide from "@/widgets/RecipeSlide/server/CookedPopularServerSlide";
import SearchDiscoveryClient from "@/widgets/SearchDiscovery/SearchDiscoveryClient";

export const searchDiscoveryMetadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
  robots: { index: false, follow: true },
};

type Props = { focused: boolean; locale?: Locale };

export const SearchDiscoveryPage = async ({
  focused,
  locale = "ko",
}: Props) => {
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
        <SearchDiscoveryClient
          focused={focused}
          cookedPopularSlot={<CookedPopularServerSlide locale={locale} />}
        />
      </HydrationBoundary>
    </Suspense>
  );
};
