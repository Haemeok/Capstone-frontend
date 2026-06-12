import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
  QueryClient,
} from "@tanstack/react-query";

import { absoluteUrl } from "@/shared/config/constants/api";
import { sortCodec } from "@/shared/lib/filters";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";
import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type {
  DetailedRecipesApiResponse,
  RecipeItemsQueryParams,
} from "@/entities/recipe/model/types";

import { buildSearchQueryKey } from "@/widgets/SearchClient/hooks/useSearchResults";
import { SearchClient } from "@/widgets/SearchClient/index";

export type LocalizedLocale = "ja" | "en";

const OG_LOCALE: Record<LocalizedLocale, string> = {
  ja: "ja_JP",
  en: "en_US",
};

type LocalizedSearchRawParams = {
  page?: string;
  q?: string;
  sort?: string;
};

type ParsedLocalizedSearchParams = {
  query: RecipeItemsQueryParams;
  page: number;
  q: string;
  sortCode: string;
  types: string[];
  nutritionQueryParams: Record<string, number>;
};

export const parseLocalizedSearchParams = (
  params: LocalizedSearchRawParams,
  locale: LocalizedLocale
): ParsedLocalizedSearchParams => {
  const page = Math.max(0, parseInt(params.page || "0", 10) || 0);
  const q = params.q || "";

  const sortCode =
    sortCodec.encode(sortCodec.decode(params.sort ?? null)) ??
    sortCodec.encode("인기순") ??
    "popularityScore,DESC";

  const nutritionParams = parseNutritionParams(params);
  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const types = parseTypes(params);

  return {
    query: {
      key: "search",
      page,
      q,
      sort: sortCode,
      types,
      lang: locale,
      ...nutritionQueryParams,
    },
    page,
    q,
    sortCode,
    types,
    nutritionQueryParams,
  };
};

type BuildLocalizedSearchMetadataArgs = {
  searchParams: LocalizedSearchRawParams;
  locale: LocalizedLocale;
};

export const buildLocalizedSearchMetadata = async ({
  searchParams,
  locale,
}: BuildLocalizedSearchMetadataArgs): Promise<Metadata> => {
  const { query, page, q } = parseLocalizedSearchParams(searchParams, locale);

  const pageData = await getRecipesOnServer(query);
  const totalElements = pageData.page.totalElements;
  const firstImage = pageData.content[0]?.imageUrl;

  const title = buildSearchTitle(q, totalElements, page, locale);
  const description = buildSearchDescription(q, totalElements, locale);

  const ogImage = firstImage || SEO_CONSTANTS.DEFAULT_IMAGE;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      siteName: SEO_CONSTANTS.SITE_NAME,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: absoluteUrl(`${locale}/search/results`),
    },
  };
};

type LocalizedSearchPageProps = {
  searchParams: LocalizedSearchRawParams;
  locale: LocalizedLocale;
};

export const LocalizedSearchPage = async ({
  searchParams,
  locale,
}: LocalizedSearchPageProps) => {
  const { query, page, sortCode, types, nutritionQueryParams } =
    parseLocalizedSearchParams(searchParams, locale);

  const queryClient = new QueryClient();

  const basePath = `/${locale}/search/results`;

  const base9 = [
    "recipes",
    null,
    sortCode,
    "",
    searchParams.q || "",
    JSON.stringify(nutritionQueryParams),
    types.join(","),
    "",
    "",
  ] as const;

  const queryKey = buildSearchQueryKey(base9, locale);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: () => getRecipesOnServer(query),
    initialPageParam: page,
    getNextPageParam,
    pages: 1,
  });

  const cached =
    queryClient.getQueryData<InfiniteData<DetailedRecipesApiResponse, number>>(
      queryKey
    );
  const firstPage: DetailedRecipesApiResponse = cached?.pages[0] ?? {
    content: [],
    page: { size: 0, number: page, totalElements: 0, totalPages: 0 },
  };

  const totalPages = firstPage.page.totalPages;
  const hasNextPage = page < totalPages - 1;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(searchParams, page + 1, basePath)
    : undefined;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchClient
        initialPage={page}
        nextPageHref={nextPageHref}
        locale={locale}
      />
    </HydrationBoundary>
  );
};
