"use server";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { requireAdminAction } from "@/shared/lib/admin-guard";

const DEFAULT_QUEUE_DIR = path.join(os.homedir(), "Desktop", "recipio-publish-queue");

export type QueueItemSnapshot = {
  name: string;
  prefix: string; // "recipe" 또는 "curation-{tone}"
  createdAt: string; // ISO
  slug?: string; // curation-meta.json 의 slug. recipe-prefix 는 undefined.
};

export type QueueSnapshot = {
  pending: QueueItemSnapshot[];
  pendingCount: number;
  postedCount: number;
  failedCount: number;
  queueDir: string;
};

const safeReadDir = (dir: string): fs.Dirent[] => {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
};

const parsePrefix = (name: string): string => {
  // 패키지명 규칙: `{prefix}-{title}-{ISO timestamp}`. prefix는 "recipe" 또는
  // "curation-{tone}". timestamp는 항상 끝에 붙음.
  const match = name.match(/^(recipe|curation-[a-z0-9]+)-/);
  return match?.[1] ?? "unknown";
};

const readSlug = (packageDir: string): string | undefined => {
  try {
    const raw = fs.readFileSync(path.join(packageDir, "curation-meta.json"), "utf8");
    const parsed = JSON.parse(raw) as { slug?: unknown };
    return typeof parsed.slug === "string" ? parsed.slug : undefined;
  } catch {
    return undefined;
  }
};

const dirItem = (dir: string, ent: fs.Dirent): QueueItemSnapshot | null => {
  if (!ent.isDirectory()) return null;
  const full = path.join(dir, ent.name);
  let mtimeMs = 0;
  try {
    mtimeMs = fs.statSync(full).mtimeMs;
  } catch {
    return null;
  }
  const slug = readSlug(full);
  return {
    name: ent.name,
    prefix: parsePrefix(ent.name),
    createdAt: new Date(mtimeMs).toISOString(),
    slug,
  };
};

export const getQueueSnapshot = async (): Promise<QueueSnapshot> => {
  await requireAdminAction();
  const queueDir = process.env.BLOG_PUBLISH_QUEUE_DIR?.trim() || DEFAULT_QUEUE_DIR;

  const pendingDir = path.join(queueDir, "pending");
  const postedDir = path.join(queueDir, "posted");
  const failedDir = path.join(queueDir, "failed");

  const pending = safeReadDir(pendingDir)
    .map((e) => dirItem(pendingDir, e))
    .filter((x): x is QueueItemSnapshot => x !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const postedCount = safeReadDir(postedDir).filter((e) => e.isDirectory()).length;
  const failedCount = safeReadDir(failedDir).filter((e) => e.isDirectory()).length;

  return {
    pending,
    pendingCount: pending.length,
    postedCount,
    failedCount,
    queueDir,
  };
};
