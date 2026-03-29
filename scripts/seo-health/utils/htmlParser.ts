import { parse } from "node-html-parser";

export type ParsedSeoData = {
  ogTags: Record<string, string>;
  jsonLd: Record<string, unknown>[];
  canonical: string | null;
  title: string | null;
};

export const parseSeoData = (html: string): ParsedSeoData => {
  const root = parse(html);

  const ogTags: Record<string, string> = {};
  const metaTags = root.querySelectorAll('meta[property^="og:"]');
  for (const tag of metaTags) {
    const property = tag.getAttribute("property");
    const content = tag.getAttribute("content");
    if (property && content) {
      ogTags[property] = content;
    }
  }

  const jsonLd: Record<string, unknown>[] = [];
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent);
      if (Array.isArray(data)) {
        jsonLd.push(...data);
      } else {
        jsonLd.push(data);
      }
    } catch {
      // skip malformed JSON-LD
    }
  }

  const canonicalTag = root.querySelector('link[rel="canonical"]');
  const canonical = canonicalTag?.getAttribute("href") ?? null;

  const titleTag = root.querySelector("title");
  const title = titleTag?.textContent ?? null;

  return { ogTags, jsonLd, canonical, title };
};

export const extractUrlsFromSitemapXml = (xml: string): string[] => {
  const root = parse(xml);
  const locs = root.querySelectorAll("loc");
  return locs.map((loc) => loc.textContent.trim());
};
