"use server";

import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, rename, unlink, writeFile } from "fs/promises";
import { join } from "path";

import type {
  GenerateCurationOutput,
  SavedCurationRecord,
} from "@/entities/curation";
import { requireAdminAction } from "@/shared/lib/admin-guard";

// Local dev-only stub. /data/ is gitignored.
const STORAGE_DIR = join(process.cwd(), "data", "curations-local");

// Atomic write — 같은 슬러그에 동시 발행이 떨어져도 partial write 로 깨지지
// 않도록 tmp 파일에 먼저 쓰고 rename 으로 교체. Node 의 rename 은 NTFS/POSIX
// 모두 atomic (Windows 도 MoveFileExW + REPLACE_EXISTING).
const writeJsonAtomic = async (
  filePath: string,
  data: unknown,
): Promise<void> => {
  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await rename(tmpPath, filePath);
  } catch (e) {
    // rename 실패 시 tmp 파일 누수 방지. unlink 자체가 실패해도 무시 (이미 없을 수 있음).
    await unlink(tmpPath).catch(() => {});
    throw e;
  }
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
  await requireAdminAction();

  await mkdir(STORAGE_DIR, { recursive: true });
  const path = join(STORAGE_DIR, `${data.slug}.json`);
  const payload: SavedCurationRecord = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  await writeJsonAtomic(path, payload);
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

  let files: string[];
  try {
    files = await readdir(STORAGE_DIR);
  } catch (e) {
    console.error("[curation-debug] listCurationLocal: readdir failed", e);
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  // per-file try/catch — 한 파일이 깨져도 나머지를 살린다. 이전엔 Promise.all 가
  // 첫 reject 에서 빠져 전체 [] 가 되어 publishedSlugs=0 으로 잘못 인식되었음.
  const results = await Promise.all(
    jsonFiles.map(async (f) => {
      try {
        const text = await readFile(join(STORAGE_DIR, f), "utf-8");
        const data = JSON.parse(text) as SavedCurationRecord;
        return {
          slug: data.slug,
          h1: data.h1,
          dek: data.dek,
          provider: data.provider,
          savedAt: data.savedAt,
        };
      } catch (e) {
        console.error(
          "[curation] listCurationLocal: skipping corrupted file",
          f,
          e instanceof Error ? e.message : e,
        );
        return null;
      }
    }),
  );

  const items = results.filter((r): r is LocalCurationListItem => r !== null);
  return items.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
};
