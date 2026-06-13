import {
  searchDiscoveryMetadata,
  SearchDiscoveryPage,
} from "@/widgets/SearchDiscovery/server/SearchDiscoveryPage";

export const metadata = searchDiscoveryMetadata;

type SearchPageProps = {
  searchParams: Promise<{ focused?: string }>;
};

export default async function JaSearchPage({ searchParams }: SearchPageProps) {
  const { focused } = await searchParams;
  return <SearchDiscoveryPage focused={focused === "1"} />;
}
