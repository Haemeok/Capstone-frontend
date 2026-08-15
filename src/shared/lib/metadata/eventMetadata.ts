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
  supportedLocales?: Locale[];
  ogImageWidth?: number;
  ogImageHeight?: number;
  openGraphTitle?: string;
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
  supportedLocales,
  ogImageWidth,
  ogImageHeight,
  openGraphTitle,
}: EventMetadataParams): Metadata => {
  const pathWithoutLocale = path.replace(/^\//, "");
  const canonical =
    locale === "ko"
      ? absoluteUrl(pathWithoutLocale)
      : absoluteUrl(`${locale}/${pathWithoutLocale}`);
  const fullTitle = `${title} | ${localizedSiteName(locale)}`;
  const allLanguages = buildHreflangAlternates(pathWithoutLocale);
  const languageKeys: Array<Locale | "x-default"> = supportedLocales
    ? [...supportedLocales, "x-default"]
    : ["ko", "ja", "en", "x-default"];
  const languages = Object.fromEntries(
    languageKeys.map((key) => [key, allLanguages[key]])
  );
  const ogTitle = openGraphTitle ?? fullTitle;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: localizedSiteName(locale),
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: OG_LOCALE[locale],
      images: [
        {
          url: ogImage,
          width: ogImageWidth ?? 1024,
          height: ogImageHeight ?? 1024,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
};
