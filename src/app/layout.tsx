import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getMyInfoOnServer } from "@/entities/user/model/api.server";

import { PWA_APP_INFO } from "@/shared/config/constants/pwa";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";

import { pretendard } from "./fonts";
import { AppProviders } from "./providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "해먹",
  description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/image.png", type: "image/png" },
      { url: "/pwa_logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://recipio.kr/"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: PWA_APP_INFO.THEME_COLOR,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const myInfo = await getMyInfoOnServer();

  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <AppProviders myInfo={myInfo}>
          <DesktopHeader />
          <main>{children}</main>
          <BottomNavBar />
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
