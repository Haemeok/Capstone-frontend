import type { Metadata } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

type Props = {
  children: React.ReactNode;
};

const title = `AI 추천 레시피 - ${SEO_CONSTANTS.SITE_NAME}`;
const description =
  "AI가 추천하는 맞춤형 홈쿡 레시피를 확인하세요. 인공지능이 선별한 최고의 요리법으로 집에서 맛있게 해먹어보세요!";
const url = `${SEO_CONSTANTS.SITE_URL}recipes/ai`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
    "AI 레시피",
    "인공지능 레시피",
    "AI 추천",
    "맞춤형 레시피",
    "AI 요리법",
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
        url: SEO_CONSTANTS.DEFAULT_IMAGE,
        alt: "AI 추천 레시피",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title,
    description,
    images: [SEO_CONSTANTS.DEFAULT_IMAGE],
  },
  alternates: {
    canonical: url,
  },
};

export default function AIRecipeLayout({ children }: Props) {
  return <>{children}</>;
}
