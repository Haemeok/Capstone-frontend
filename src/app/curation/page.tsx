import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPageParam } from "@/shared/lib/utils";

import { fetchCurationArticleList } from "@/features/curation";

import { CurationListClient } from "@/widgets/CurationList";
import {
  buildCurationListQueryKey,
  CURATION_LIST_PAGE_SIZE,
} from "@/widgets/CurationList/hooks/useCurationArticles";

export const metadata: Metadata = {
  title: "큐레이션 | recipio",
  description: "오늘 무엇을 먹을까. 테마별로 묶은 레시피 큐레이션.",
};

type SearchParams = Promise<{
  category?: string;
  page?: string;
}>;

const parsePage = (raw: string | undefined): number => {
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen bg-white py-6 sm:py-10">
        <CurationListClient category={category} initialPage={initialPage} />
      </main>
    </HydrationBoundary>
  );
};

export default Page;
