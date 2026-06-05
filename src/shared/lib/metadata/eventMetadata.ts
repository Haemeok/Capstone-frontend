import type { Metadata } from "next";

import { SEO_CONSTANTS } from "./constants";

type EventMetadataParams = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogImageAlt: string;
};

export const buildEventMetadata = ({
  path,
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
}: EventMetadataParams): Metadata => {
  const url = `${SEO_CONSTANTS.SITE_URL}${path}`;
  const fullTitle = `${title} | ${SEO_CONSTANTS.SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: SEO_CONSTANTS.LOCALE,
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
