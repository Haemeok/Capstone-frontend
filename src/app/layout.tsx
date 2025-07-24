import type { Metadata, Viewport } from "next";

import { conditionalInitSentry } from "@/shared/lib/sentry";

import { getMyInfoOnServer } from "@/entities/user/model/api.server";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import { NotificationTest } from "@/widgets/NotificationTest";

import { AppProviders } from "./providers/AppProviders";

import "./globals.css";

if (typeof window !== "undefined") {
  conditionalInitSentry();
}

export const metadata: Metadata = {
  title: "해먹",
  description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2a2229",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const myInfo = await getMyInfoOnServer();

  return (
    <html lang="ko">
      <body>
        <AppProviders myInfo={myInfo}>
          {children}
          <BottomNavBar />
          <NotificationTest />
        </AppProviders>
      </body>
    </html>
  );
}
