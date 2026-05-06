"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminAction } from "@/shared/lib/admin-guard";

export const revalidateCurationPath = async (slug: string): Promise<void> => {
  await requireAdminAction();

  revalidateTag(`curation:${slug}`);
  revalidatePath(`/curation/${slug}`);
};
