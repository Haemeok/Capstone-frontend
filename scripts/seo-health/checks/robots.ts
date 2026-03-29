import type { CheckResult } from "../types.js";
import { fetchPage } from "../utils/fetcher.js";

export const checkRobots = async (): Promise<CheckResult[]> => {
  const results: CheckResult[] = [];

  const res = await fetchPage("/robots.txt");

  if (!res.ok) {
    results.push({
      name: "robots.txt",
      status: "fail",
      message: `HTTP ${res.status}`,
    });
    return results;
  }

  const body = res.body;

  const hasUserAgent = /User-agent:/i.test(body);
  if (!hasUserAgent) {
    results.push({
      name: "robots.txt format",
      status: "fail",
      message: "Missing User-agent directive",
    });
    return results;
  }

  const sitemapMatches = body.match(/Sitemap:\s*(.+)/gi);
  if (!sitemapMatches || sitemapMatches.length === 0) {
    results.push({
      name: "robots.txt sitemap ref",
      status: "fail",
      message: "No Sitemap references found",
    });
    return results;
  }

  results.push({
    name: "robots.txt",
    status: "pass",
    message: `OK (${sitemapMatches.length} sitemap refs)`,
  });

  return results;
};
