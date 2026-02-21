import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/react";

import { AppWebViewDetector } from "@/shared/lib/bridge";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";
import GlobalLoginEncourageDrawer from "@/widgets/LoginEncourageDrawer/GlobalLoginEncourageDrawer";
import GlobalNotificationPermissionDrawer from "@/widgets/NotificationPermissionDrawer";
import GlobalReviewGateDrawer from "@/widgets/ReviewGateDrawer";

import { pretendard } from "./fonts";
import { AppProviders } from "./providers/AppProviders";
import GoogleAnalytics from "./GoogleAnalytics";

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
        url: "/back1.webp",
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
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`scroll-smooth ${pretendard.variable}`}>
      <body className={`${pretendard.className} bg-white`}>
        <AppWebViewDetector />
        <AppProviders>
          <DesktopHeader />
          <main className="flex w-full flex-1 flex-col pb-[77px] md:pb-0">
            {children}
          </main>
          <BottomNavBar />
          <GlobalLoginEncourageDrawer />
          <GlobalNotificationPermissionDrawer />
          <GlobalReviewGateDrawer />
        </AppProviders>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
