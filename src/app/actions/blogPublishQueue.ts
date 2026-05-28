"use server";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { BlogPost } from "@/app/admin/recipe-blog-test/lib/blogPost.schema";
import { blogIdForTone } from "@/app/admin/recipe-blog-test/lib/blogToneAssignment";
import type { CurationBlogPost } from "@/app/admin/recipe-blog-test/lib/curationBlogPost.schema";
import { saveQueuePackage } from "@/app/admin/recipe-blog-test/lib/saveQueuePackage";
import type { BlogTone } from "@/app/admin/recipe-blog-test/lib/toneInserts";

import { getQueueSnapshot } from "./getQueueSnapshot";

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
  tone: BlogTone;
  curationTitle: string;
  imageUrlsBySlot: Record<string, string>;
  curationMeta: CurationMeta;
  recipes: StaticRecipe[];
};

type CurationRecipeMeta = {
  title: string;
  url: string;
  servings: number;
  ingredients: RecipeMetaIngredient[];
  nutritionTotal: {
    calories: number;
    protein: number;
    carbohydrate: number;
    fat: number;
    sugar: number;
    sodium: number;
  };
  totalIngredientCost: number;
  marketPrice: number;
};

const toCurationRecipesMeta = (
  recipes: StaticRecipe[]
): Record<string, CurationRecipeMeta> => {
  const map: Record<string, CurationRecipeMeta> = {};
  for (const r of recipes) {
    map[r.id] = {
      title: r.title,
      url: `https://recipio.kr/recipes/${r.id}`,
      servings: r.servings,
      ingredients: r.ingredients.map((i) => ({
        name: i.name,
        quantity: i.quantity ?? null,
        unit: i.unit ?? null,
      })),
      nutritionTotal: {
        calories: r.totalCalories,
        protein: r.nutrition.protein,
        carbohydrate: r.nutrition.carbohydrate,
        fat: r.nutrition.fat,
        sugar: r.nutrition.sugar,
        sodium: r.nutrition.sodium,
      },
      totalIngredientCost: r.totalIngredientCost,
      marketPrice: r.marketPrice,
    };
  }
  return map;
};

export const enqueueCurationBlogPostForPublish = async (
  input: EnqueueCurationInput
): Promise<EnqueueBlogPostResult> => {
  await requireAdminAction();

  try {
    const snapshot = await getQueueSnapshot();
    const dup = snapshot.pending.find((p) => p.slug === input.curationMeta.slug);
    if (dup) {
      return {
        success: false,
        error: `이미 큐에 있어요 (slug=${input.curationMeta.slug}): ${dup.name}`,
      };
    }

    // tone → blogId 매핑 (NAVER_BLOG_IDS env 순서대로 ceil(N/M) 분배). 등록 0이면 null.
    // 발행부는 targetBlogId 가 있으면 그 계정으로만 pick. null 이면 free pick (역호환).
    const targetBlogId = blogIdForTone(input.tone);
    const { packagePath, savedSlots, skippedSlots } = await saveQueuePackage({
      prefix: `curation-${input.tone}`,
      title: input.curationTitle,
      jsonFiles: {
        "post.json": input.post,
        "curation-meta.json": {
          ...input.curationMeta,
          tone: input.tone,
          targetBlogId,
        },
        "recipes-meta.json": toCurationRecipesMeta(input.recipes),
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
