import { buildLandingMetadata } from "@/shared/lib/metadata";

import { LandingView } from "@/features/landing";

export const metadata = buildLandingMetadata("ja");

export default function Page() {
  return <LandingView locale="ja" />;
}
