"use server";

import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import type { GenerateCurationOutput } from "@/entities/curation";

// 로컬 dev 전용. /data/ 디렉토리가 .gitignore라 commit 안 됨.
// 어드민에서 생성한 큐레이션을 임시 보관하고 아티클 페이지(`/curation/[slug]`)
// 에서 fetch해 미리보기. DB/API 연결 전 단계의 미리보기 stub.
const STORAGE_DIR = join(process.cwd(), "data", "curations-local");

export type LocalCurationRecord = GenerateCurationOutput & {
  savedAt: string;
};

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
  await mkdir(STORAGE_DIR, { recursive: true });
  const path = join(STORAGE_DIR, `${data.slug}.json`);
  const payload: LocalCurationRecord = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  await writeFile(path, JSON.stringify(payload, null, 2), "utf-8");
  return { ok: true, relPath: `data/curations-local/${data.slug}.json` };
};

export const getCurationLocal = async (
  slug: string,
): Promise<LocalCurationRecord | null> => {
  try {
    const text = await readFile(join(STORAGE_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(text) as LocalCurationRecord;
  } catch {
    return null;
  }
};

export const listCurationLocal = async (): Promise<LocalCurationListItem[]> => {
  try {
    const files = await readdir(STORAGE_DIR);
    const items = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const text = await readFile(join(STORAGE_DIR, f), "utf-8");
          const data = JSON.parse(text) as LocalCurationRecord;
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
