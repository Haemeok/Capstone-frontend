"use server";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import type { BlogPost } from "@/app/admin/recipe-blog-test/lib/blogPost.schema";
import type { CurationBlogPost } from "@/app/admin/recipe-blog-test/lib/curationBlogPost.schema";
import { saveQueuePackage } from "@/app/admin/recipe-blog-test/lib/saveQueuePackage";

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

type EnqueueRecipeInput = {
  post: BlogPost;
  recipeTitle: string;
  imageUrlsBySlot: Record<string, string>;
  recipeMeta?: RecipeMeta;
};

export type EnqueueBlogPostResult =
  | { success: true; packagePath: string; savedSlots: string[]; skippedSlots: string[] }
  | { success: false; error: string };

export const enqueueBlogPostForPublish = async (
  input: EnqueueRecipeInput
): Promise<EnqueueBlogPostResult> => {
  await requireAdminAction();

  try {
    const jsonFiles: Record<string, unknown> = { "post.json": input.post };
    if (input.recipeMeta) {
      jsonFiles["recipe-meta.json"] = input.recipeMeta;
    }

    const { packagePath, savedSlots, skippedSlots } = await saveQueuePackage({
      prefix: "recipe",
      title: input.recipeTitle,
      jsonFiles,
      imageUrlsBySlot: input.imageUrlsBySlot,
    });

    return { success: true, packagePath, savedSlots, skippedSlots };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};

type CurationMeta = {
  slug: string;
  recipeIds: string[];
  brandLink: { text: string; url: string };
};

type EnqueueCurationInput = {
  post: CurationBlogPost;
  curationTitle: string;
  imageUrlsBySlot: Record<string, string>;
  curationMeta: CurationMeta;
};

export const enqueueCurationBlogPostForPublish = async (
  input: EnqueueCurationInput
): Promise<EnqueueBlogPostResult> => {
  await requireAdminAction();

  try {
    const { packagePath, savedSlots, skippedSlots } = await saveQueuePackage({
      prefix: "curation",
      title: input.curationTitle,
      jsonFiles: {
        "post.json": input.post,
        "curation-meta.json": input.curationMeta,
      },
      imageUrlsBySlot: input.imageUrlsBySlot,
    });

    return { success: true, packagePath, savedSlots, skippedSlots };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
