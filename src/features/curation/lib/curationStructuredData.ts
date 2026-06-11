import { absoluteUrl } from "@/shared/config/constants/api";
import {
  createCurationBreadcrumb,
  createCurationListBreadcrumb,
} from "@/shared/lib/metadata/breadcrumbSchema";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import { isCurationCategory } from "@/entities/curation";
import { CATEGORY_META } from "@/entities/curation/model/categoryMeta";

import type {
  PublicCurationArticleDto,
  PublicCurationArticleListItemDto,
} from "../model/api.server";
import { coverImageUrlFromKey } from "./coverImageUrl";

const SITE_URL = SEO_CONSTANTS.SITE_URL;

const PUBLISHER = {
  "@type": "Organization" as const,
  name: SEO_CONSTANTS.SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: absoluteUrl("og.png"),
  },
};

export const createCurationDetailJsonLd = (data: PublicCurationArticleDto) => {
  const fullUrl = absoluteUrl(`curation/${data.slug}`);
  const meta = isCurationCategory(data.category)
    ? CATEGORY_META[data.category]
    : null;
  const coverUrl =
    coverImageUrlFromKey(data.coverImageKey) ?? SEO_CONSTANTS.DEFAULT_IMAGE;

  return {
    "@context": "https://schema.org",
    "@graph": [
      createCurationBreadcrumb(data.title, data.slug, meta?.koLabel ?? null),
      {
        "@type": "Article",
        headline: data.title,
        description: data.description ?? undefined,
        image: [coverUrl],
        datePublished: data.publishedAt,
        author: {
          "@type": "Organization",
          name: SEO_CONSTANTS.SITE_NAME,
          url: SITE_URL,
        },
        publisher: PUBLISHER,
        mainEntityOfPage: fullUrl,
        articleSection: meta?.koLabel ?? undefined,
      },
    ],
  };
};

export const createCurationListJsonLd = (
  category: string | null,
  items: PublicCurationArticleListItemDto[]
) => {
  const valid = category && isCurationCategory(category) ? category : null;
  const meta = valid ? CATEGORY_META[valid] : null;
  const canonical = valid
    ? absoluteUrl(`curation?category=${encodeURIComponent(valid)}`)
    : absoluteUrl("curation");
  const title = meta
    ? `${meta.koLabel} 큐레이션 | ${SEO_CONSTANTS.SITE_NAME}`
    : `큐레이션 매거진 | ${SEO_CONSTANTS.SITE_NAME}`;
  const description = meta
    ? `${meta.description}. 테마별로 큐레이션한 레시피 모음.`
    : "다이어트·집밥·홈파티까지. 테마별로 묶은 레시피 큐레이션을 한 곳에서.";

  const itemList = items.slice(0, 12).map((it, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    url: absoluteUrl(`curation/${it.slug}`),
    name: it.title,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      createCurationListBreadcrumb(meta?.koLabel ?? null),
      {
        "@type": "CollectionPage",
        name: title,
        description,
        url: canonical,
        isPartOf: {
          "@type": "WebSite",
          name: SEO_CONSTANTS.SITE_NAME,
          url: SITE_URL,
        },
        about: meta?.koLabel ?? undefined,
      },
      {
        "@type": "ItemList",
        itemListElement: itemList,
      },
    ],
  };
};
