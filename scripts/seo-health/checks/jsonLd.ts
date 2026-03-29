import { config } from "../config.js";
import type { CheckResult } from "../types.js";
import { fetchPage } from "../utils/fetcher.js";
import { parseSeoData } from "../utils/htmlParser.js";

export const checkJsonLd = async (
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
    } catch {
      continue;
    }

    if (!res.ok) continue;

    const seo = parseSeoData(res.body);

    if (seo.jsonLd.length === 0) {
      const isHomePage = pagePath === "/";
      const isRecipePage = /\/recipes\/\d+$/.test(pagePath);

      if (isHomePage || isRecipePage) {
        results.push({
          name: `JSON-LD ${pagePath}`,
          status: "fail",
          message: "No JSON-LD found (expected on this page type)",
        });
      }
      continue;
    }

    for (const schema of seo.jsonLd) {
      const schemaType = schema["@type"] as string | undefined;
      if (!schemaType) continue;

      const requiredFields = config.requiredJsonLdFields[schemaType];
      if (!requiredFields) continue;

      const missingFields = requiredFields.filter(
        (field) => !(field in schema)
      );

      if (missingFields.length > 0) {
        results.push({
          name: `JSON-LD ${schemaType} ${pagePath}`,
          status: "fail",
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      } else {
        results.push({
          name: `JSON-LD ${schemaType} ${pagePath}`,
          status: "pass",
          message: "OK",
        });
      }
    }
  }

  return results;
};
