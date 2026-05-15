import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const DEFAULT_QUEUE_DIR = path.join(
  os.homedir(),
  "Desktop",
  "recipio-publish-queue"
);

const FILENAME_UNSAFE = /[\\/:*?"<>|]/g;

const sanitizeFilename = (s: string): string =>
  s.replace(FILENAME_UNSAFE, "_").slice(0, 60).trim();

const dataUrlToBuffer = (dataUrl: string): Buffer => {
  const match = dataUrl.match(/^data:image\/[a-z+]+;base64,(.+)$/i);
  if (!match) throw new Error("dataUrl 형식이 아니에요");
  return Buffer.from(match[1], "base64");
};

const fetchUrlToBuffer = async (url: string): Promise<Buffer> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 fetch 실패 (${res.status})`);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
};

const imageUrlToBuffer = async (imageUrl: string): Promise<Buffer> =>
  imageUrl.startsWith("data:") ? dataUrlToBuffer(imageUrl) : fetchUrlToBuffer(imageUrl);

export type SaveQueuePackageInput = {
  /** 폴더명 prefix. recipe / curation 모드별로 다르게 박는다. */
  prefix: string;
  /** 폴더명 본문에 들어갈 사람 친화 제목. */
  title: string;
  /** 저장할 JSON 파일들 (filename → object). post.json 등. */
  jsonFiles: Record<string, unknown>;
  /** 슬롯 키 → 이미지 URL (data: 또는 http). */
  imageUrlsBySlot: Record<string, string>;
};

export type SaveQueuePackageResult = {
  packagePath: string;
  savedSlots: string[];
  skippedSlots: string[];
};

export const saveQueuePackage = async (
  input: SaveQueuePackageInput
): Promise<SaveQueuePackageResult> => {
  const queueDir = process.env.BLOG_PUBLISH_QUEUE_DIR?.trim() || DEFAULT_QUEUE_DIR;
  const pendingDir = path.join(queueDir, "pending");
  await fs.mkdir(pendingDir, { recursive: true });

  const safeTitle = sanitizeFilename(input.title) || "untitled";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const packageName = `${input.prefix}-${safeTitle}-${stamp}`;
  const packagePath = path.join(pendingDir, packageName);
  await fs.mkdir(packagePath, { recursive: true });

  for (const [name, obj] of Object.entries(input.jsonFiles)) {
    await fs.writeFile(
      path.join(packagePath, name),
      JSON.stringify(obj, null, 2),
      "utf8"
    );
  }

  const savedSlots: string[] = [];
  const skippedSlots: string[] = [];
  for (const [slot, url] of Object.entries(input.imageUrlsBySlot)) {
    try {
      const buf = await imageUrlToBuffer(url);
      const safeSlot = slot.replace(FILENAME_UNSAFE, "_");
      await fs.writeFile(path.join(packagePath, `${safeSlot}.png`), buf);
      savedSlots.push(slot);
    } catch (err) {
      console.warn(`[saveQueuePackage] 이미지 저장 실패 slot=${slot}:`, err);
      skippedSlots.push(slot);
    }
  }

  return { packagePath, savedSlots, skippedSlots };
};
