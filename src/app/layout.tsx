import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/react";

import { getMyInfoOnServer } from "@/entities/user/model/api.server";

import { PWA_APP_INFO } from "@/shared/config/constants/pwa";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";

import { pretendard } from "./fonts";
import { AppProviders } from "./providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "레시피오",
  description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/app-logo-512.png", type: "image/png", sizes: "192x192" },
      { url: "/app-logo-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/app-logo-512.png",
  },
  metadataBase: new URL("https://www.recipio.kr/"),
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
      </body>
    </html>
  );
}
