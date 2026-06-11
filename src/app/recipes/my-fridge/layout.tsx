import type { Metadata } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export const metadata: Metadata = {
  title: `요리 가능한 레시피 - ${SEO_CONSTANTS.SITE_NAME}`,
  robots: {
    index: false,
    follow: true,
  },
};

export default function MyFridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
