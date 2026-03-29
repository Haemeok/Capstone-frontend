import { config } from "../config.js";
import type { CheckResult } from "../types.js";
import { fetchPage } from "../utils/fetcher.js";
import { parseSeoData } from "../utils/htmlParser.js";

export const checkCanonical = async (
  pageUrls: string[]
): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];

  for (const pageUrl of pageUrls) {
    const fullUrl = pageUrl.startsWith("http")
      ? pageUrl
      : `${config.baseUrl}${pageUrl}`;

    let res;
    try {
      res = await fetchPage(pageUrl);
    } catch {
      continue;
    }

    if (!res.ok) continue;

    const seo = parseSeoData(res.body);
    const pagePath = pageUrl.startsWith("http")
      ? new URL(pageUrl).pathname + new URL(pageUrl).search
      : pageUrl;

    if (!seo.canonical) {
      results.push({
        name: `canonical ${pagePath}`,
        status: "warn",
        message: "No canonical tag found",
      });
      continue;
    }

    const normalizeUrl = (u: string) => u.replace(/\/$/, "");
    if (normalizeUrl(seo.canonical) !== normalizeUrl(fullUrl)) {
      results.push({
        name: `canonical ${pagePath}`,
        status: "fail",
        message: `Mismatch: canonical="${seo.canonical}" vs expected="${fullUrl}"`,
      });
    } else {
      results.push({
        name: `canonical ${pagePath}`,
        status: "pass",
        message: "OK",
      });
    }
  }

  return results;
};
