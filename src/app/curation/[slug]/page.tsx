import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getCurationLocal } from "@/app/actions/curationLocal";
import { CurationArticle } from "@/features/curation/ui/CurationArticle";

const cachedGet = cache(getCurationLocal);

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) return {};
  return {
    title: data.h1,
    description: data.dek,
    openGraph: {
      title: data.h1,
      description: data.dek,
      images: data.thumbnailUrl ? [{ url: data.thumbnailUrl }] : [],
    },
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) notFound();
  return <CurationArticle data={data} />;
};

export default Page;
