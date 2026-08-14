import { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import {
  CATEGORY_BASE_URL,
  TagCode,
  TAGS_BY_CODE,
  TAGS_IMAGE_KEYS,
} from "@/shared/config/constants/recipe";
import type { Locale, TranslatedLocale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import {
  alternateLocales,
  localizedSiteName,
  OG_LOCALE,
} from "@/shared/lib/metadata/localized";

import { buildCategoryPageHref } from "./categoryPagination";

type BuildCategoryMetadataArgs = {
  id: string;
  publicPage: number;
  locale: Locale;
};

const COLLECTION_TITLE: Record<TranslatedLocale, (name: string) => string> = {
  ja: (name) => `${name}のレシピ集`,
  en: (name) => `${name} recipes`,
};

const COLLECTION_DESCRIPTION: Record<
  TranslatedLocale,
  (name: string, siteName: string) => string
> = {
  ja: (name, siteName) => `${name}のレシピを${siteName}でチェックしましょう。`,
  en: (name, siteName) =>
    `Browse ${name} recipes on ${siteName} and find your next dish.`,
};

const PAGE_LABEL: Record<Locale, (publicPage: number) => string> = {
  ko: (publicPage) => (publicPage > 1 ? ` (${publicPage}페이지)` : ""),
  ja: (publicPage) => (publicPage > 1 ? `（${publicPage}ページ目）` : ""),
  en: (publicPage) => (publicPage > 1 ? ` (Page ${publicPage})` : ""),
};

const buildKoMetadata = (
  id: string,
  tagName: string,
  publicPage: number,
  imageUrl: string,
  url: string
): Metadata => {
  const pageLabel = PAGE_LABEL.ko(publicPage);
  const title = `${tagName} 모음${pageLabel} | ${SEO_CONSTANTS.SITE_NAME}`;
  const description = `${tagName}를 ${SEO_CONSTANTS.SITE_NAME}에서 확인해보세요. 다양한 ${tagName} 관련 요리를 추천해드립니다.`;

  const baseMetadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONSTANTS.SITE_NAME,
      locale: OG_LOCALE.ko,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${tagName} 대표 이미지`,
        },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  if (id === "CHEF_RECIPE") {
    const chefTitle = `흑백요리사 & 15분 레시피 후기 모음${pageLabel} | RECIPIO`;
    const chefDescription =
      "다양한 흑백요리사, 냉장고를 부탁해 등 유명 셰프들의 15분 레시피 후기를 만나보세요. 집에서 즐기는 파인다이닝, 누구나 쉽게 따라 할 수 있는 셰프의 비법을 공개합니다.";

    return {
      ...baseMetadata,
      title: chefTitle,
      description: chefDescription,
      openGraph: {
        ...baseMetadata.openGraph,
        title: chefTitle,
        description: chefDescription,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: "셰프 레시피 컬렉션",
          },
        ],
      },
      twitter: {
        ...baseMetadata.twitter,
        title: chefTitle,
        description: chefDescription,
        images: [imageUrl],
      },
    };
  }

  return baseMetadata;
};

const buildLocalizedMetadata = (
  id: string,
  locale: TranslatedLocale,
  tagName: string,
  publicPage: number,
  imageUrl: string,
  url: string
): Metadata => {
  const pageLabel = PAGE_LABEL[locale](publicPage);
  const siteName = localizedSiteName(locale);
  const title = `${COLLECTION_TITLE[locale](tagName)}${pageLabel} | ${siteName}`;
  const description = COLLECTION_DESCRIPTION[locale](tagName, siteName);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`recipes/category/${id}`),
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales(locale),
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: tagName,
        },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
};

export const buildCategoryMetadata = ({
  id,
  publicPage,
  locale,
}: BuildCategoryMetadataArgs): Metadata => {
  const tagCode = id as TagCode;
  const tagImageKey = TAGS_IMAGE_KEYS[tagCode];
  const imageUrl = tagImageKey
    ? `${CATEGORY_BASE_URL}${tagImageKey}`
    : SEO_CONSTANTS.DEFAULT_IMAGE;
  const url = absoluteUrl(
    buildCategoryPageHref({ tagCode: id, locale, publicPage })
  );

  if (locale === "ko") {
    const tagName = TAGS_BY_CODE[tagCode]?.name ?? "레시피";
    return buildKoMetadata(id, tagName, publicPage, imageUrl, url);
  }

  const tagName = taxonomyMessages[locale].tags[tagCode] ?? id;
  return buildLocalizedMetadata(id, locale, tagName, publicPage, imageUrl, url);
};
