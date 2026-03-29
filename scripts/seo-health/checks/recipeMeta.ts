import { config } from "../config.js";
import type { CheckResult } from "../types.js";
import { fetchWithRetry, fetchPage } from "../utils/fetcher.js";
import { parseSeoData } from "../utils/htmlParser.js";

type ApiRecipe = {
  title: string;
  description?: string;
  imageUrl?: string;
  youtubeChannelName?: string;
};

export const checkRecipeMeta = async (
  recipeUrls: string[]
): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];

  for (const recipeUrl of recipeUrls) {
    const idMatch = recipeUrl.match(/\/recipes\/(\d+)$/);
    if (!idMatch) continue;

    const recipeId = idMatch[1];

    let apiRecipe: ApiRecipe;
    try {
      const apiRes = await fetchWithRetry(
        `${config.apiBaseUrl}/api/v2/recipes/${recipeId}`
      );
      if (!apiRes.ok) {
        results.push({
          name: `recipe meta API ${recipeId}`,
          status: "warn",
          message: `API returned ${apiRes.status}`,
        });
        continue;
      }
      apiRecipe = JSON.parse(apiRes.body);
    } catch (err) {
      results.push({
        name: `recipe meta API ${recipeId}`,
        status: "warn",
        message: `API fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    let pageRes;
    try {
      pageRes = await fetchPage(recipeUrl);
    } catch {
      continue;
    }

    if (!pageRes.ok) continue;

    const seo = parseSeoData(pageRes.body);

    if (seo.title && !seo.title.includes(apiRecipe.title)) {
      results.push({
        name: `recipe meta title ${recipeId}`,
        status: "fail",
        message: `Page title "${seo.title.slice(0, 60)}" doesn't contain recipe name "${apiRecipe.title}"`,
      });
    } else if (seo.title) {
      results.push({
        name: `recipe meta title ${recipeId}`,
        status: "pass",
        message: "OK",
      });
    }

    const ogImage = seo.ogTags["og:image"];
    if (ogImage && apiRecipe.imageUrl && !ogImage.includes("og.png")) {
      results.push({
        name: `recipe meta image ${recipeId}`,
        status: "pass",
        message: "OK (recipe-specific image)",
      });
    } else if (ogImage && apiRecipe.imageUrl && ogImage.includes("og.png")) {
      results.push({
        name: `recipe meta image ${recipeId}`,
        status: "fail",
        message: "Using default og.png instead of recipe image",
      });
    }
  }

  return results;
};
