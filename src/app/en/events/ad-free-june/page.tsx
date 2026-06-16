import type { Metadata } from "next";

import { getDictionary } from "@/shared/i18n";
import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { AdFreeJuneEventView } from "@/features/events";

export const metadata: Metadata = buildEventMetadata({
  path: "/events/ad-free-june",
  locale: "en",
  ogImage: "/events/ad-free-june/hero.png",
  ...getDictionary("en").events.adFreeJune.meta,
});

export default function Page() {
  return <AdFreeJuneEventView locale="en" />;
}
