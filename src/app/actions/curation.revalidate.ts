"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const revalidateCurationPath = async (slug: string): Promise<void> => {
  revalidateTag(`curation:${slug}`);
  revalidatePath(`/curation/${slug}`);
};
