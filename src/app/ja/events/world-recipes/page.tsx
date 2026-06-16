import type { Metadata } from "next";

import { getDictionary } from "@/shared/i18n";
import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { WorldRecipesEventView } from "@/features/events";

export const metadata: Metadata = buildEventMetadata({
  path: "/events/world-recipes",
  locale: "ja",
  ogImage: "/events/world-recipes/hero.png",
  ...getDictionary("ja").events.worldRecipes.meta,
});

export default function Page() {
  return <WorldRecipesEventView locale="ja" />;
}
