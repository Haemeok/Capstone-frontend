import type { ReactNode } from "react";
import type { Metadata } from "next";

import { YETI_INDEX } from "@/shared/lib/metadata/localized";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  other: YETI_INDEX,
};

const JaAIRecipeLayout = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

export default JaAIRecipeLayout;
