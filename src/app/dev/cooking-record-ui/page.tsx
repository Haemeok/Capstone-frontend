import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { isDevelopment } from "@/shared/config/development";

import { CookingRecordUiPreview } from "./_components/CookingRecordUiPreview";

export const metadata: Metadata = {
  title: "요리 기록 UI 미리보기",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
const Page = () => {
  if (!isDevelopment) notFound();
  return <CookingRecordUiPreview />;
};
export default Page;
