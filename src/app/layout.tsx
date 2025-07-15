import type { Metadata, Viewport } from "next";

import "./globals.css";
import { AppProviders } from "./providers/AppProviders";

import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import { NotificationTest } from "@/widgets/NotificationTest";
import { conditionalInitSentry } from "@/shared/lib/sentry";
import { getMyInfoOnServer } from "@/entities/user/model/api.server";

// Sentry 초기화 (클라이언트 사이드에서만)
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
