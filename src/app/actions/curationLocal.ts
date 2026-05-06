"use server";

import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import type {
  GenerateCurationOutput,
  SavedCurationRecord,
} from "@/entities/curation";
import { requireAdminAction } from "@/shared/lib/admin-guard";

// Local dev-only stub. /data/ is gitignored.
const STORAGE_DIR = join(process.cwd(), "data", "curations-local");

export type LocalCurationListItem = {
  slug: string;
  h1: string;
  dek: string;
  provider: string;
  savedAt: string;
};

export const saveCurationLocal = async (
  data: GenerateCurationOutput,
): Promise<{ ok: true; relPath: string }> => {
  await requireAdminAction();

  await mkdir(STORAGE_DIR, { recursive: true });
  const path = join(STORAGE_DIR, `${data.slug}.json`);
  const payload: SavedCurationRecord = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  await writeFile(path, JSON.stringify(payload, null, 2), "utf-8");
  return { ok: true, relPath: `data/curations-local/${data.slug}.json` };
};

export const getCurationLocal = async (
  slug: string,
): Promise<SavedCurationRecord | null> => {
  await requireAdminAction();

  try {
    const text = await readFile(join(STORAGE_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(text) as SavedCurationRecord;
  } catch {
    return null;
  }
};

export const listCurationLocal = async (): Promise<LocalCurationListItem[]> => {
  await requireAdminAction();

  try {
    const files = await readdir(STORAGE_DIR);
    const items = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const text = await readFile(join(STORAGE_DIR, f), "utf-8");
          const data = JSON.parse(text) as SavedCurationRecord;
          return {
            slug: data.slug,
            h1: data.h1,
            dek: data.dek,
            provider: data.provider,
            savedAt: data.savedAt,
          };
        }),
    );
    return items.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  } catch {
    return [];
  }
};
