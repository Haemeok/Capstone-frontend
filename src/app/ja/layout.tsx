import type { Metadata } from "next";

import { YETI_NOINDEX } from "@/shared/lib/metadata/localized";

export const metadata: Metadata = {
  other: YETI_NOINDEX,
};

export default function JaLocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
