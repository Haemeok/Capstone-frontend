import { patchEdgeConfig } from "@/shared/edge-config/patchEdgeConfig";
import { type Bloom, buildBloom } from "@/shared/lib/bloom";
import { SEED_ISR_IDS } from "@/shared/lib/bloom/seedIsrIds";

import { fetchRecipeSitemapPage } from "@/entities/recipe/model/api.server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PAGE_SIZE = 20000;
const MAX_PAGES = 50;
const MAX_IDS = 100000;
const EDGE_CONFIG_VALUE_LIMIT = 62 * 1024;
const FP_CANDIDATES = [0.001, 0.002, 0.005, 0.01, 0.02];

const fetchIndexedRecipeIds = async (): Promise<string[]> => {
  const ids: string[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const recipes = await fetchRecipeSitemapPage(page, PAGE_SIZE);
    if (recipes.length === 0) break;
    for (const recipe of recipes) ids.push(recipe.id);
    if (ids.length >= MAX_IDS || recipes.length < PAGE_SIZE) break;
  }
  return ids;
};

const buildFittingBloom = (
  ids: string[],
  version: number
): { bloom: Bloom; bytes: number; fp: number } | null => {
  for (const fp of FP_CANDIDATES) {
    const bloom = buildBloom(ids, { fp, version });
    const bytes = Buffer.byteLength(JSON.stringify(bloom), "utf8");
    if (bytes <= EDGE_CONFIG_VALUE_LIMIT) return { bloom, bytes, fp };
  }
  return null;
};

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }

  const ids = await fetchIndexedRecipeIds();
  if (ids.length === 0) {
    return Response.json(
      { ok: false, reason: "no ids fetched — keeping existing bloom" },
      { status: 502 }
    );
  }

  const merged = [...new Set([...ids, ...SEED_ISR_IDS])];

  const fitted = buildFittingBloom(merged, Date.now());
  if (!fitted) {
    return Response.json(
      {
        ok: false,
        reason: "bloom exceeds Edge Config limit at every FP",
        n: merged.length,
      },
      { status: 507 }
    );
  }

  try {
    await patchEdgeConfig("indexedBloom", fitted.bloom);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        reason: "edge config write failed",
        detail: error instanceof Error ? error.message : String(error),
        n: merged.length,
        fp: fitted.fp,
        bytes: fitted.bytes,
      },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    n: merged.length,
    sitemap: ids.length,
    seed: SEED_ISR_IDS.length,
    fp: fitted.fp,
    bytes: fitted.bytes,
    m: fitted.bloom.m,
    k: fitted.bloom.k,
  });
}
