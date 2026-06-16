import { buildLandingMetadata } from "@/shared/lib/metadata";

import { LandingView } from "@/features/landing";

export const metadata = buildLandingMetadata("ko");

export default function Page() {
  return <LandingView locale="ko" />;
}
