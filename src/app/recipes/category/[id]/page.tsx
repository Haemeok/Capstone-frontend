import { Metadata } from "next";
import CategoryDetailClient from "./CategoryDetailClient";
import {
  TAGS_BY_CODE,
  CATEGORY_BASE_URL,
  TAGS_IMAGE_KEYS,
  TagCode,
} from "@/shared/config/constants/recipe";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [{ id: "CHEF_RECIPE" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tagCode = id as TagCode;
  const tagDef = TAGS_BY_CODE[tagCode];
  const tagName = tagDef?.name ?? "레시피";

  const title = `${tagName} 모음 | ${SEO_CONSTANTS.SITE_NAME}`;
  const description = `${tagName}를 ${SEO_CONSTANTS.SITE_NAME}에서 확인해보세요. 다양한 ${tagName} 관련 요리를 추천해드립니다.`;
  const url = `${SEO_CONSTANTS.SITE_URL}recipes/category/${id}`;

  const tagImageKey = TAGS_IMAGE_KEYS[tagCode];
  const imageUrl = tagImageKey
    ? `${CATEGORY_BASE_URL}${tagImageKey}`
    : SEO_CONSTANTS.DEFAULT_IMAGE;

  const baseMetadata: Metadata = {
    title,
    description,
    keywords: [
      ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
      tagName,
      `${tagName} 레시피`,
      "요리 추천",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONSTANTS.SITE_NAME,
      locale: SEO_CONSTANTS.LOCALE,
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
    const chefTitle = "흑백요리사 & 15분 레시피 후기 모음 | RECIPIO";
    const chefDescription =
      "다양한 흑백요리사, 냉장고를 부탁해 등 유명 셰프들의 15분 레시피 후기를 만나보세요. 집에서 즐기는 파인다이닝, 누구나 쉽게 따라 할 수 있는 셰프의 비법을 공개합니다.";

    return {
      ...baseMetadata,
      title: chefTitle,
      description: chefDescription,
      keywords: [
        "흑백요리사",
        "흑백요리사2",
        "냉장고를부탁해",
        "15분레시피",
        "냉장고를부탁해 15분레시피",
        "셰프 레시피",
        "파인다이닝",
        "RECIPIO",
        "안성재",
        "최현석",
        "에드워드 리",
      ],
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
}

export default function Page() {
  return <CategoryDetailClient />;
}
