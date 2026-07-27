import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";
import { localizedSiteName } from "./localized";

type EventMetadataParams = {
  path: string;
  locale: Locale;
  title: string;
  description: string;
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
  ogImage,
  ogImageAlt,
}: EventMetadataParams): Metadata => {
  const pathWithoutLocale = path.replace(/^\//, "");
  const canonical =
    locale === "ko"
      ? absoluteUrl(pathWithoutLocale)
      : absoluteUrl(`${locale}/${pathWithoutLocale}`);
  const fullTitle = `${title} | ${localizedSiteName(locale)}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(pathWithoutLocale),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: localizedSiteName(locale),
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
