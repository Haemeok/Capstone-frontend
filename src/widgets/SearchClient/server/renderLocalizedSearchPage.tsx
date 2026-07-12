import { Suspense } from "react";
import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { TranslatedLocale } from "@/shared/i18n";
import { sortCodec } from "@/shared/lib/filters";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { localizedSiteName } from "@/shared/lib/metadata/localized";
import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";
import {
  buildRecipeSearchBaseKey,
  buildSearchQueryKey,
} from "@/shared/lib/search/recipeSearchQueryKey";

import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";
import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type {
  DetailedRecipesApiResponse,
  RecipeItemsQueryParams,
} from "@/entities/recipe/model/types";

import { SearchClientShell } from "../index";
import { SearchGridSkeleton } from "../ui/SearchResultsSkeleton";
import { SearchResultsData } from "./SearchResultsData";

const OG_LOCALE: Record<TranslatedLocale, string> = {
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
  locale: TranslatedLocale
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
  locale: TranslatedLocale;
};

export const buildLocalizedSearchMetadata = async ({
  searchParams,
  locale,
}: BuildLocalizedSearchMetadataArgs): Promise<Metadata> => {
  const { query, page, q } = parseLocalizedSearchParams(searchParams, locale);

  const pageData = await getRecipesOnServer(query);
  const firstImage = pageData.content[0]?.imageUrl;

  const title = buildSearchTitle(q, page, locale);
  const description = buildSearchDescription(q, locale);

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
      siteName: localizedSiteName(locale),
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
  locale: TranslatedLocale;
};

export const LocalizedSearchPage = ({
  searchParams,
  locale,
}: LocalizedSearchPageProps) => {
  const { query, page, sortCode, types, nutritionQueryParams } =
    parseLocalizedSearchParams(searchParams, locale);

  const basePath = `/${locale}/search/results`;

  const base = buildRecipeSearchBaseKey({
    dishTypeCode: null,
    sortCode,
    tagCodes: [],
    q: searchParams.q || "",
    nutritionQueryParams,
    types,
    ingredientIds: [],
    creatorCountryTags: [],
  });

  const queryKey = buildSearchQueryKey(base, locale);

  const buildNextHref = (firstPage: DetailedRecipesApiResponse) =>
    firstPage.slice.hasNext
      ? buildNextPageUrl(searchParams, page + 1, basePath)
      : undefined;

  return (
    <SearchClientShell>
      <Suspense fallback={<SearchGridSkeleton />}>
        <SearchResultsData
          queryKey={queryKey}
          queryFn={() => getRecipesOnServer(query)}
          page={page}
          locale={locale}
          buildNextHref={buildNextHref}
        />
      </Suspense>
    </SearchClientShell>
  );
};
