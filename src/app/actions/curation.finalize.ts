"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { randomUUID } from "crypto";
import { mkdir, rename, unlink, writeFile } from "fs/promises";
import { join } from "path";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import {
  type GenerateCurationOutput,
  type SavedCurationRecord,
} from "@/entities/curation";

const STORAGE_DIR = join(process.cwd(), "data", "curations-local");

const writeJsonAtomic = async (
  filePath: string,
  data: unknown
): Promise<void> => {
  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await rename(tmpPath, filePath);
  } catch (e) {
    await unlink(tmpPath).catch(() => {});
    throw e;
  }
};

export type FinalizeCurationBatchResult = {
  saved: number;
  saveErrors: { slug: string; message: string }[];
};

export const finalizeCurationBatch = async (
  records: GenerateCurationOutput[]
): Promise<FinalizeCurationBatchResult> => {
  await requireAdminAction();

  // 같은 batch 안에 같은 슬러그가 두 번 들어와도 한 번만 쓴다 (마지막 항목 우선).
  // 보통은 caller 가 dedupe 하지만 안전망.
  const uniqueRecords = Array.from(
    new Map(records.map((r) => [r.slug, r])).values()
  );

  for (const r of uniqueRecords) {
    revalidateTag(`curation:${r.slug}`);
    revalidatePath(`/curation/${r.slug}`);
  }

  if (uniqueRecords.length === 0) return { saved: 0, saveErrors: [] };

  await mkdir(STORAGE_DIR, { recursive: true });

  const saveErrors: { slug: string; message: string }[] = [];
  let saved = 0;
  await Promise.all(
    uniqueRecords.map(async (r) => {
      const filePath = join(STORAGE_DIR, `${r.slug}.json`);
      try {
        const payload: SavedCurationRecord = {
          ...r,
          savedAt: new Date().toISOString(),
        };
        await writeJsonAtomic(filePath, payload);
        saved += 1;
      } catch (e) {
        saveErrors.push({
          slug: r.slug,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    })
  );

  return { saved, saveErrors };
};
