"use server";

import { mkdir, writeFile } from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import { join } from "path";

import {
  type GenerateCurationOutput,
  type SavedCurationRecord,
} from "@/entities/curation";
import { requireAdminAction } from "@/shared/lib/admin-guard";

const STORAGE_DIR = join(process.cwd(), "data", "curations-local");

export type FinalizeCurationBatchResult = {
  saved: number;
  saveErrors: { slug: string; message: string }[];
};

export const finalizeCurationBatch = async (
  records: GenerateCurationOutput[],
): Promise<FinalizeCurationBatchResult> => {
  await requireAdminAction();

  for (const r of records) {
    revalidateTag(`curation:${r.slug}`);
    revalidatePath(`/curation/${r.slug}`);
  }

  if (records.length === 0) return { saved: 0, saveErrors: [] };

  await mkdir(STORAGE_DIR, { recursive: true });

  const saveErrors: { slug: string; message: string }[] = [];
  let saved = 0;
  await Promise.all(
    records.map(async (r) => {
      try {
        const payload: SavedCurationRecord = {
          ...r,
          savedAt: new Date().toISOString(),
        };
        await writeFile(
          join(STORAGE_DIR, `${r.slug}.json`),
          JSON.stringify(payload, null, 2),
          "utf-8",
        );
        saved += 1;
      } catch (e) {
        saveErrors.push({
          slug: r.slug,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }),
  );

  return { saved, saveErrors };
};
