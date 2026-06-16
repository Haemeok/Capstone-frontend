import { buildLandingMetadata } from "@/shared/lib/metadata";

import { LandingView } from "@/features/landing";

export const metadata = buildLandingMetadata("en");

export default function Page() {
  return <LandingView locale="en" />;
}
