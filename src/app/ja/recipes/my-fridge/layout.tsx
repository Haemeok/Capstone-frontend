import type { Metadata } from "next";

import { getDictionary } from "@/shared/i18n";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export const metadata: Metadata = {
  title: `${getDictionary("ja").fridge.metaTitle} - ${SEO_CONSTANTS.SITE_NAME}`,
  robots: {
    index: false,
    follow: true,
  },
};

export default function JaMyFridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
