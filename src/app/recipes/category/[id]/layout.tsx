import type { Metadata } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { TagCode, TAGS_BY_CODE } from "@/shared/config/constants/recipe";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagCode = params.id as TagCode;
  const tagDef = TAGS_BY_CODE[tagCode];

  if (!tagDef) {
    return {
      title: "카테고리 - 레시피오",
      description: SEO_CONSTANTS.SITE_DESCRIPTION,
    };
  }

  const categoryName = tagDef.name;
  const emoji = tagDef.emoji;
  const title = `${emoji} ${categoryName} 레시피 모음 - ${SEO_CONSTANTS.SITE_NAME}`;
  const description = `${categoryName} 카테고리의 인기 레시피를 확인하세요. AI가 추천하는 맞춤형 ${categoryName} 요리법으로 집에서 맛있게 해먹어보세요!`;
  const url = `${SEO_CONSTANTS.SITE_URL}recipes/category/${tagCode}`;
  const imageUrl = SEO_CONSTANTS.DEFAULT_IMAGE;

  return {
    title,
    description,
    keywords: [
      ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
      categoryName,
      `${categoryName} 레시피`,
      `${categoryName} 요리법`,
      "카테고리별 레시피",
    ],
    openGraph: {
      title,
      description,
      url,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: SEO_CONSTANTS.LOCALE,
      siteName: SEO_CONSTANTS.SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: `${categoryName} 레시피 모음`,
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
    alternates: {
      canonical: url,
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
