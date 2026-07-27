import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { type TagCode, TAGS_BY_CODE } from "@/shared/config/constants/recipe";
import { format, getDictionary, type Locale } from "@/shared/i18n";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export const buildCategoryMetadata = async (
  params: Promise<{ id: string }>,
  locale: Locale
): Promise<Metadata> => {
  const { id } = await params;
  const tagCode = id as TagCode;
  const tagDef = TAGS_BY_CODE[tagCode];
  const t = getDictionary(locale);

  if (!tagDef) {
    return {
      title: t.category.meta.fallbackTitle,
      description: SEO_CONSTANTS.SITE_DESCRIPTION,
    };
  }

  const name = t.taxonomy.tags[tagCode] ?? tagDef.name;
  const emoji = tagDef.emoji;
  const m = t.category.meta;
  const siteName = locale === "ko" ? SEO_CONSTANTS.SITE_NAME : "Recipio";
  const title = `${format(m.titleTemplate, { emoji, name })} - ${siteName}`;
  const description = format(m.descriptionTemplate, { name });
  const url = absoluteUrl(`recipes/category/${tagCode}`);
  const imageUrl = SEO_CONSTANTS.DEFAULT_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: SEO_CONSTANTS.LOCALE,
      siteName,
      images: [
        {
          url: imageUrl,
          alt: format(m.imageAltTemplate, { name }),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
    ...(locale === "ko" ? {} : { robots: { index: false, follow: true } }),
  };
};
