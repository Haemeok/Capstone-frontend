import type { Metadata } from "next";

import {
  buildLocalizedSearchMetadata,
  LocalizedSearchPage,
} from "@/widgets/SearchClient/server/renderLocalizedSearchPage";

type Props = {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return buildLocalizedSearchMetadata({
    searchParams: await searchParams,
    locale: "en",
  });
}

export default async function EnSearchResultsPage({ searchParams }: Props) {
  return <LocalizedSearchPage searchParams={await searchParams} locale="en" />;
}
