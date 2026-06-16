import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";

type EventMetadataParams = {
  path: string;
  locale: Locale;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogImageAlt: string;
};

const OG_LOCALE: Record<Locale, string> = {
  ko: SEO_CONSTANTS.LOCALE,
  ja: "ja_JP",
  en: "en_US",
};

export const buildEventMetadata = ({
  path,
  locale,
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
}: EventMetadataParams): Metadata => {
  const pathWithoutLocale = path.replace(/^\//, "");
  const canonical =
    locale === "ko"
      ? absoluteUrl(pathWithoutLocale)
      : absoluteUrl(`${locale}/${pathWithoutLocale}`);
  const fullTitle = `${title} | ${SEO_CONSTANTS.SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords:
      locale === "ko"
        ? [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...keywords]
        : keywords,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(pathWithoutLocale),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: OG_LOCALE[locale],
      images: [{ url: ogImage, width: 1024, height: 1024, alt: ogImageAlt }],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
};
