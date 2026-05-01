"use server";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { BlogPost } from "@/app/admin/recipe-blog-test/lib/blogPost.schema";

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

type RecipeMetaIngredient = {
  name: string;
  quantity?: string | null;
  unit?: string | null;
};

type RecipeMeta = {
  servings?: number;
  ingredients?: RecipeMetaIngredient[];
  brandLink?: { text: string; url: string } | null;
};

type EnqueueInput = {
  post: BlogPost;
  recipeTitle: string;
  imageUrlsBySlot: Record<string, string>;
  recipeMeta?: RecipeMeta;
};

export type EnqueueBlogPostResult =
  | { success: true; packagePath: string; savedSlots: string[]; skippedSlots: string[] }
  | { success: false; error: string };

export const enqueueBlogPostForPublish = async (
  input: EnqueueInput
): Promise<EnqueueBlogPostResult> => {
  try {
    const queueDir = process.env.BLOG_PUBLISH_QUEUE_DIR?.trim() || DEFAULT_QUEUE_DIR;
    const pendingDir = path.join(queueDir, "pending");
    await fs.mkdir(pendingDir, { recursive: true });

    const safeTitle = sanitizeFilename(input.recipeTitle) || "untitled";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const packageName = `${safeTitle}-${stamp}`;
    const packagePath = path.join(pendingDir, packageName);
    await fs.mkdir(packagePath, { recursive: true });

    await fs.writeFile(
      path.join(packagePath, "post.json"),
      JSON.stringify(input.post, null, 2),
      "utf8"
    );

    if (input.recipeMeta) {
      await fs.writeFile(
        path.join(packagePath, "recipe-meta.json"),
        JSON.stringify(input.recipeMeta, null, 2),
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
        console.warn(`[enqueueBlogPostForPublish] 이미지 저장 실패 slot=${slot}:`, err);
        skippedSlots.push(slot);
      }
    }

    return { success: true, packagePath, savedSlots, skippedSlots };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
