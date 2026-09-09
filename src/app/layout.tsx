// i18n-ignore-file: 루트 레이아웃 — ko 홈 기본 OG 메타(페이지별 override), 사용자 본문 카피 없음
import type { Metadata, Viewport } from "next";

import { RootShell } from "./RootShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "레시피오",
  description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  metadataBase: new URL("https://www.recipio.kr/"),
  openGraph: {
    title: "레시피오",
    description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
    url: "https://www.recipio.kr/",
    siteName: "레시피오 - recipio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "레시피오 - 홈쿡 레시피",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com"
        />
        <link
          rel="dns-prefetch"
          href="https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Recipio – All"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Recipio – Recipes"
          href="/feed/recipes.xml"
        />
      </head>
      <body className="bg-white font-sans">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
