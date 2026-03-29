import { config } from "../config.js";
import type { CheckResult } from "../types.js";
import { fetchPage, headRequest } from "../utils/fetcher.js";
import { parseSeoData } from "../utils/htmlParser.js";

export const checkOgTags = async (
  pageUrls: string[]
): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];

  for (const pageUrl of pageUrls) {
    const pagePath = pageUrl.startsWith("http")
      ? new URL(pageUrl).pathname + new URL(pageUrl).search
      : pageUrl;

    let res;
    try {
      res = await fetchPage(pageUrl);
    } catch (err) {
      results.push({
        name: `OG tags ${pagePath}`,
        status: "fail",
        message: `Fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    if (!res.ok) {
      results.push({
        name: `page status ${pagePath}`,
        status: "fail",
        message: `HTTP ${res.status}`,
      });
      continue;
    }

    const seo = parseSeoData(res.body);
    const missingTags = config.requiredOgTags.filter(
      (tag) => !seo.ogTags[tag]
    );

    if (missingTags.length > 0) {
      results.push({
        name: `OG tags ${pagePath}`,
        status: "fail",
        message: `Missing: ${missingTags.join(", ")}`,
      });
    } else {
      results.push({
        name: `OG tags ${pagePath}`,
        status: "pass",
        message: "OK",
      });
    }

    const ogImage = seo.ogTags["og:image"];
    if (ogImage) {
      try {
        const imageStatus = await headRequest(ogImage);
        if (imageStatus >= 400) {
          results.push({
            name: `OG image ${pagePath}`,
            status: "fail",
            message: `og:image returned ${imageStatus}: ${ogImage}`,
          });
        }
      } catch {
        results.push({
          name: `OG image ${pagePath}`,
          status: "fail",
          message: `og:image unreachable: ${ogImage}`,
        });
      }
    }
  }

  return results;
};
