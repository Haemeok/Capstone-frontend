// i18n-ignore-file: 루트 레이아웃 — ko 브랜드/RSS 피드 메타, 사용자 본문 카피 없음
import type { Metadata, Viewport } from "next";

import { AdSenseScript } from "@/shared/adsense";
import { AppContextBridge } from "@/shared/lib/analytics";
import { AppWebViewDetector } from "@/shared/lib/bridge";

import { BottomLayoutController } from "@/widgets/Footer/BottomLayoutController";
import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";

import { pretendard } from "./fonts";
import GlobalDrawers from "./GlobalDrawers";
import GoogleAnalytics from "./GoogleAnalytics";
import { AppProviders } from "./providers/AppProviders";

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
    <html lang="ko" className={`scroll-smooth ${pretendard.variable}`}>
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
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://googleads.g.doubleclick.net"
          crossOrigin="anonymous"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="레시피오 – 전체"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="레시피오 – 레시피"
          href="/feed/recipes.xml"
        />
      </head>
      <body className={`${pretendard.className} bg-white`}>
        <AppWebViewDetector />
        <AppProviders>
          <DesktopHeader />
          <main className="flex w-full flex-1 flex-col pb-[var(--main-pb,var(--bottom-nav-h))] md:pb-0">
            {children}
          </main>
          <BottomNavBar />
          <BottomLayoutController />
          <GlobalDrawers />
          <AdSenseScript />
        </AppProviders>
        <GoogleAnalytics />
        <AppContextBridge />
      </body>
    </html>
  );
}
