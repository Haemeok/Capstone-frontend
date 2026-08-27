import type { Metadata } from "next";

import { getDictionary } from "@/shared/i18n";
import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { AdFreeSeptemberEventView } from "@/features/events";

export const metadata: Metadata = buildEventMetadata({
  path: "/events/ad-free-september",
  locale: "en",
  ogImage: "/events/ad-free-september/hero.png",
  ...getDictionary("en").events.adFreeSeptember.meta,
});

const Page = () => <AdFreeSeptemberEventView locale="en" />;

export default Page;
