import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/react";

import { PWA_APP_INFO } from "@/shared/config/constants/pwa";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";
import GlobalLoginEncourageDrawer from "@/widgets/LoginEncourageDrawer/GlobalLoginEncourageDrawer";

import { pretendard } from "./fonts";
import { AppProviders } from "./providers/AppProviders";
import GoogleAnalytics from "./GoogleAnalytics";

import "./globals.css";

export const metadata: Metadata = {
  title: "레시피오",
  description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  manifest: "/manifest.json?v=260102",
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "https://www.recipio.kr/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "레시피오",
  },
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
  themeColor: PWA_APP_INFO.THEME_COLOR,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`scroll-smooth ${pretendard.variable}`}>
      <body className={pretendard.className}>
        <AppProviders>
          <DesktopHeader />
          <main className="flex w-full flex-1 flex-col pb-[77px] md:pb-0">
            {children}
          </main>
          <BottomNavBar />
          <GlobalLoginEncourageDrawer />
        </AppProviders>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
