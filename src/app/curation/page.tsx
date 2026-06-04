import type { Metadata } from "next";

import type { InfiniteData } from "@tanstack/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPageParam } from "@/shared/lib/utils";

import {
  createCurationListJsonLd,
  type CurationArticleListResponse,
  fetchCurationArticleList,
  generateCurationListMetadata,
} from "@/features/curation";

import { CurationListClient } from "@/widgets/CurationList";
import {
  buildCurationListQueryKey,
  CURATION_LIST_PAGE_SIZE,
} from "@/widgets/CurationList/hooks/useCurationArticles";

type SearchParams = Promise<{
  category?: string;
  page?: string;
}>;

const parsePage = (raw: string | undefined): number => {
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> => {
  const sp = await searchParams;
  const category = sp.category?.trim() || null;
  return generateCurationListMetadata(category);
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const category = sp.category?.trim() || null;
  const initialPage = parsePage(sp.page);

  const queryClient = new QueryClient();
  const queryKey = buildCurationListQueryKey(category);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: () =>
      fetchCurationArticleList({
        category: category ?? undefined,
        page: initialPage,
        size: CURATION_LIST_PAGE_SIZE,
      }),
    initialPageParam: initialPage,
    getNextPageParam,
    pages: 1,
  });

  const cached =
    queryClient.getQueryData<InfiniteData<CurationArticleListResponse>>(
      queryKey
    );
  const firstPageItems = cached?.pages[0]?.content ?? [];
  const jsonLd = createCurationListJsonLd(category, firstPageItems);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen bg-white py-6 sm:py-10">
        <CurationListClient category={category} initialPage={initialPage} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </HydrationBoundary>
  );
};

export default Page;
