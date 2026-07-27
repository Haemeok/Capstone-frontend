import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import { isCurationCategory } from "@/entities/curation";
import { CATEGORY_META } from "@/entities/curation/model/categoryMeta";

import type { PublicCurationArticleDto } from "../model/api.server";
import { coverImageUrlFromKey } from "./coverImageUrl";

export const generateCurationDetailMetadata = (
  data: PublicCurationArticleDto,
  recipeCount: number
): Metadata => {
  const fullUrl = absoluteUrl(`curation/${data.slug}`);
  const meta = isCurationCategory(data.category)
    ? CATEGORY_META[data.category]
    : null;

  const title = `${data.title} | ${SEO_CONSTANTS.SITE_NAME}`;
  const trimmedDescription = data.description?.trim() ?? "";
  const description = trimmedDescription
    ? `${trimmedDescription} 추천 레시피 ${recipeCount}가지를 한 페이지에 모았어요.`
    : `${meta?.koLabel ?? "레시피"} 큐레이션 — ${data.title}. 레시피 ${recipeCount}가지 모음.`;

  const ogImage =
    coverImageUrlFromKey(data.coverImageKey) ?? SEO_CONSTANTS.DEFAULT_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: fullUrl },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: SEO_CONSTANTS.LOCALE,
      images: [{ url: ogImage, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [ogImage],
    },
  };
};

export const generateCurationListMetadata = (
  category: string | null
): Metadata => {
  const valid = category && isCurationCategory(category) ? category : null;
  const meta = valid ? CATEGORY_META[valid] : null;

  const title = meta
    ? `${meta.koLabel} 큐레이션 | ${SEO_CONSTANTS.SITE_NAME}`
    : `큐레이션 매거진 | ${SEO_CONSTANTS.SITE_NAME} — 오늘 뭐 먹지?`;

  const description = meta
    ? `${meta.description}. 테마별로 큐레이션한 레시피 모음.`
    : "다이어트·집밥·홈파티까지. 테마별로 묶은 레시피 큐레이션을 한 곳에서.";

  const canonical = valid
    ? absoluteUrl(`curation?category=${encodeURIComponent(valid)}`)
    : absoluteUrl("curation");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: SEO_CONSTANTS.LOCALE,
      images: [
        {
          url: SEO_CONSTANTS.DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [SEO_CONSTANTS.DEFAULT_IMAGE],
    },
  };
};
