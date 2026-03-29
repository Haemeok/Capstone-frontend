import { execSync } from "child_process";

import { config } from "../config.js";
import type { CheckResult } from "../types.js";

export const checkLighthouseSeo = async (
  pageUrls: string[]
): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];

  for (const pageUrl of pageUrls) {
    const fullUrl = pageUrl.startsWith("http")
      ? pageUrl
      : `${config.baseUrl}${pageUrl}`;

    const pagePath = pageUrl.startsWith("http")
      ? new URL(pageUrl).pathname
      : pageUrl;

    try {
      const output = execSync(
        `npx @lhci/cli collect --url="${fullUrl}" --numberOfRuns=1 --headless=new && npx @lhci/cli assert --preset=lighthouse:no-pwa`,
        {
          encoding: "utf-8",
          timeout: 120_000,
          stdio: ["pipe", "pipe", "pipe"],
        }
      );

      const seoMatch = output.match(/categories\.seo.*?(\d+\.?\d*)/i);
      const seoScore = seoMatch ? parseFloat(seoMatch[1]) * 100 : null;

      if (seoScore !== null && seoScore < config.thresholds.lighthouseSeo) {
        results.push({
          name: `Lighthouse SEO ${pagePath}`,
          status: "fail",
          message: `Score ${seoScore} < ${config.thresholds.lighthouseSeo}`,
        });
      } else {
        results.push({
          name: `Lighthouse SEO ${pagePath}`,
          status: "pass",
          message: seoScore !== null ? `Score: ${seoScore}` : "OK (assertions passed)",
        });
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      if (errorMsg.includes("categories:seo")) {
        results.push({
          name: `Lighthouse SEO ${pagePath}`,
          status: "fail",
          message: `SEO assertion failed`,
          details: errorMsg.slice(0, 500),
        });
      } else {
        results.push({
          name: `Lighthouse SEO ${pagePath}`,
          status: "warn",
          message: `Lighthouse error: ${errorMsg.slice(0, 200)}`,
        });
      }
    }
  }

  return results;
};
