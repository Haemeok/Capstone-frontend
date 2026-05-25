import type { Metadata, Viewport } from "next";

import { AdSenseScript } from "@/shared/adsense";
import { AppWebViewDetector } from "@/shared/lib/bridge";

import GlobalAppUpdateDrawer from "@/widgets/AppUpdateDrawer";
import { BottomLayoutController } from "@/widgets/Footer/BottomLayoutController";
import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";
import GlobalLoginEncourageDrawer from "@/widgets/LoginEncourageDrawer/GlobalLoginEncourageDrawer";
import GlobalNotificationPermissionDrawer from "@/widgets/NotificationPermissionDrawer";
import GlobalReviewGateDrawer from "@/widgets/ReviewGateDrawer";

import { pretendard } from "./fonts";
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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="레시피오 – 큐레이션"
          href="/feed/curation.xml"
        />
      </head>
      <body className={`${pretendard.className} bg-white`}>
        <AppWebViewDetector />
        <AppProviders>
          <DesktopHeader />
          <main className="flex w-full flex-1 flex-col pb-[var(--main-pb,77px)] md:pb-0">
            {children}
          </main>
          <BottomNavBar />
          <BottomLayoutController />
          <GlobalLoginEncourageDrawer />
          <GlobalNotificationPermissionDrawer />
          <GlobalReviewGateDrawer />
          <GlobalAppUpdateDrawer />
          {/* AdSenseScript는 AdsGateProvider 안에서 게이트를 받으므로
              AppProviders 내부에 둔다. next/script 의 afterInteractive 전략은
              컴포넌트의 DOM 위치와 무관하게 <head>로 주입되므로 위치 변경에
              따른 로딩 타이밍 영향은 없다. */}
          <AdSenseScript />
        </AppProviders>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
