import type { Metadata } from "next";

import { getDictionary } from "@/shared/i18n";
import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { AdFreeSeptemberEventView } from "@/features/events";

export const metadata: Metadata = buildEventMetadata({
  path: "/events/ad-free-september",
  locale: "ko",
  ogImage: "/events/ad-free-september/hero.png",
  ...getDictionary("ko").events.adFreeSeptember.meta,
});

const Page = () => <AdFreeSeptemberEventView locale="ko" />;

export default Page;
