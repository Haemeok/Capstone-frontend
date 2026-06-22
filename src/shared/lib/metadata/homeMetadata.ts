import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { getDictionary, type Locale } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";
import { alternateLocales, localizedSiteName, OG_LOCALE } from "./localized";

export const buildHomeMetadata = (locale: Locale): Metadata => {
  const m = getDictionary(locale).home.meta;
  const url = locale === "ko" ? SEO_CONSTANTS.SITE_URL : absoluteUrl(locale);
  return {
    title: m.title,
    description: m.description,
    ...(locale === "ko" && {
      verification: {
        other: {
          "naver-site-verification": "7c2a4d7a2d320196a11bcf8e31524a1827f41b99",
        },
      },
    }),
    alternates: { canonical: url },
    openGraph: {
      title: localizedSiteName(locale),
      description: m.description,
      url,
      siteName: localizedSiteName(locale),
      images: [
        {
          url: SEO_CONSTANTS.DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: m.ogImageAlt,
        },
      ],
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales(locale),
      type: "website",
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: m.title,
      description: m.description,
      images: [SEO_CONSTANTS.DEFAULT_IMAGE],
    },
  };
};
