"use server";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import type { CurationParams } from "@/entities/curation";

import { listCurationLocal } from "@/app/actions/curationLocal";
import { slugify } from "@/app/admin/curation-test/lib/slugify";

export type AllowlistEntryWithSlug<T extends CurationParams = CurationParams> =
  {
    entry: T;
    slug: string;
  };

export const getUnpublishedAllowlistEntries = async <T extends CurationParams>(
  entries: T[]
): Promise<AllowlistEntryWithSlug<T>[]> => {
  await requireAdminAction();

  const published = await listCurationLocal();
  const publishedSlugs = new Set(published.map((p) => p.slug));

  const result: AllowlistEntryWithSlug<T>[] = [];
  for (const entry of entries) {
    const slug = slugify(entry);
    if (publishedSlugs.has(slug)) continue;
    result.push({ entry, slug });
  }
  return result;
};
