import {
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
  QueryClient,
} from "@tanstack/react-query";

import type { Locale } from "@/shared/i18n";
import { getNextSlicePageParam } from "@/shared/lib/utils";

import type { DetailedRecipesApiResponse } from "@/entities/recipe/model/types";

import { SearchResultsGrid } from "../index";

type Props = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<DetailedRecipesApiResponse>;
  page: number;
  locale: Locale;
  buildNextHref: (firstPage: DetailedRecipesApiResponse) => string | undefined;
  buildJsonLd?: (firstPage: DetailedRecipesApiResponse) => unknown;
};

export const SearchResultsData = async ({
  queryKey,
  queryFn,
  page,
  locale,
  buildNextHref,
  buildJsonLd,
}: Props) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: page,
    getNextPageParam: getNextSlicePageParam,
    pages: 1,
  });

  const cached =
    queryClient.getQueryData<InfiniteData<DetailedRecipesApiResponse, number>>(
      queryKey
    );
  const firstPage: DetailedRecipesApiResponse = cached?.pages[0] ?? {
    content: [],
    slice: { size: 0, number: page, numberOfElements: 0, hasNext: false },
  };

  const nextPageHref = buildNextHref(firstPage);
  const jsonLd = buildJsonLd?.(firstPage);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <SearchResultsGrid
        initialPage={page}
        nextPageHref={nextPageHref}
        locale={locale}
      />
    </HydrationBoundary>
  );
};
