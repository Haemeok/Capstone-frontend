"use server";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { requireAdminAction } from "@/shared/lib/admin-guard";

const DEFAULT_QUEUE_DIR = path.join(
  os.homedir(),
  "Desktop",
  "recipio-publish-queue"
);

export type DeleteQueueItemResult = {
  ok: boolean;
  reason?: string;
  trashedPath?: string;
};

export const deleteQueueItem = async (input: {
  name: string;
}): Promise<DeleteQueueItemResult> => {
  await requireAdminAction();
  const { name } = input;
  // path traversal 차단 — basename 만 허용.
  if (
    !name ||
    name !== path.basename(name) ||
    name.includes("..") ||
    name.startsWith(".")
  ) {
    return { ok: false, reason: "invalid name" };
  }
  const queueDir =
    process.env.BLOG_PUBLISH_QUEUE_DIR?.trim() || DEFAULT_QUEUE_DIR;
  const src = path.join(queueDir, "pending", name);
  try {
    if (!fs.statSync(src).isDirectory()) {
      return { ok: false, reason: "디렉터리가 아닙니다" };
    }
  } catch {
    return { ok: false, reason: "pending 에 해당 항목이 없습니다" };
  }
  const trashedDir = path.join(queueDir, "trashed");
  fs.mkdirSync(trashedDir, { recursive: true });
  const dest = path.join(trashedDir, `${name}-${Date.now()}`);
  fs.renameSync(src, dest);
  return { ok: true, trashedPath: dest };
};
