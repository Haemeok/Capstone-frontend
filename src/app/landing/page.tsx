import { landingMetadata } from "@/shared/lib/metadata";

import LandingPage from "./LandingPage.client";

export const metadata = landingMetadata;

export default function Page() {
  return <LandingPage />;
}
