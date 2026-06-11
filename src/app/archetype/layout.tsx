import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const title = `요리 취향 아키타입 진단 - ${SEO_CONSTANTS.SITE_NAME}`;
const description =
  "몇 가지 질문으로 나의 요리 취향 유형을 알아보고, 취향에 맞는 레시피를 추천받아보세요.";
const url = absoluteUrl("archetype");

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
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

export default function ArchetypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
