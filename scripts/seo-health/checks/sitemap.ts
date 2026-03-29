import * as fs from "fs";
import * as path from "path";

import { config } from "../config.js";
import type { CheckResult } from "../types.js";
import { fetchPage } from "../utils/fetcher.js";
import { extractUrlsFromSitemapXml } from "../utils/htmlParser.js";

const CACHE_FILE = path.resolve(
  process.env.GITHUB_WORKSPACE ?? process.cwd(),
  "sitemap-url-count-cache.json"
);

type SitemapUrlCache = {
  counts: Record<string, number>;
  updatedAt: string;
};

const loadCache = (): SitemapUrlCache | null => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
};

const saveCache = (counts: Record<string, number>): void => {
  const cache: SitemapUrlCache = {
    counts,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
};

export const checkSitemaps = async (): Promise<{
  results: CheckResult[];
  allUrls: string[];
}> => {
  const results: CheckResult[] = [];
  const allUrls: string[] = [];

  for (const sitemapPath of config.sitemapPaths) {
    const res = await fetchPage(sitemapPath);

    if (!res.ok) {
      results.push({
        name: `sitemap ${sitemapPath}`,
        status: "fail",
        message: `HTTP ${res.status}`,
      });
      continue;
    }

    const urls = extractUrlsFromSitemapXml(res.body);

    if (urls.length === 0) {
      results.push({
        name: `sitemap ${sitemapPath}`,
        status: "fail",
        message: "Empty sitemap (0 URLs)",
      });
      continue;
    }

    allUrls.push(...urls);

    results.push({
      name: `sitemap ${sitemapPath}`,
      status: "pass",
      message: `OK (${urls.length.toLocaleString()} URLs)`,
    });
  }

  return { results, allUrls };
};

export const checkSitemapUrlCountDrop = async (
  allUrls: string[]
): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];
  const currentTotal = allUrls.length;

  const cache = loadCache();

  if (!cache) {
    const counts: Record<string, number> = {};
    for (const sitemapPath of config.sitemapPaths) {
      counts[sitemapPath] = allUrls.filter((u) =>
        u.includes(sitemapPath.replace(".xml", ""))
      ).length;
    }
    saveCache(counts);

    results.push({
      name: "sitemap URL count",
      status: "pass",
      message: `Baseline saved (${currentTotal.toLocaleString()} total URLs)`,
    });
    return results;
  }

  const previousTotal = Object.values(cache.counts).reduce((a, b) => a + b, 0);

  if (previousTotal === 0) {
    saveCache(
      Object.fromEntries(
        config.sitemapPaths.map((p) => [p, currentTotal / config.sitemapPaths.length])
      )
    );
    results.push({
      name: "sitemap URL count",
      status: "pass",
      message: `Baseline updated (${currentTotal.toLocaleString()} total URLs)`,
    });
    return results;
  }

  const dropPercent =
    ((previousTotal - currentTotal) / previousTotal) * 100;

  const newCounts: Record<string, number> = {};
  for (const sitemapPath of config.sitemapPaths) {
    newCounts[sitemapPath] = allUrls.filter((u) =>
      u.includes(sitemapPath.replace("/sitemap/", "/sitemap").replace(".xml", ""))
    ).length || Math.round(currentTotal / config.sitemapPaths.length);
  }
  saveCache(newCounts);

  if (dropPercent > config.thresholds.sitemapUrlDropPercent) {
    results.push({
      name: "sitemap URL count",
      status: "fail",
      message: `URL count dropped ${dropPercent.toFixed(1)}% (${previousTotal.toLocaleString()} → ${currentTotal.toLocaleString()})`,
    });
  } else {
    results.push({
      name: "sitemap URL count",
      status: "pass",
      message: `OK (${currentTotal.toLocaleString()} URLs, ${dropPercent > 0 ? `-${dropPercent.toFixed(1)}%` : `+${Math.abs(dropPercent).toFixed(1)}%`} vs previous)`,
    });
  }

  return results;
};

export const pickRecipeSampleUrls = (allUrls: string[]): string[] => {
  const recipeUrls = allUrls.filter((u) =>
    /\/recipes\/\d+$/.test(u)
  );

  if (recipeUrls.length === 0) return [];

  const shuffled = [...recipeUrls].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.dynamicRecipeSampleCount);
};

export const pickRandomSampleUrls = (allUrls: string[]): string[] => {
  const shuffled = [...allUrls].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.randomSampleCount);
};
