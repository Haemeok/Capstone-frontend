import { landingMetadata } from "@/shared/lib/metadata";

import { LandingView } from "@/features/landing";

export const metadata = landingMetadata;

export default function Page() {
  return <LandingView locale="ko" />;
}
