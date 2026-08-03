export type SitemapUrlEntry = { loc: string; lastModified?: string };

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export const escapeXml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);

const lastModTag = (lastModified?: string): string => {
  if (!lastModified) return "";
  const parsed = new Date(lastModified);
  if (Number.isNaN(parsed.getTime())) return "";
  return `\n    <lastmod>${parsed.toISOString()}</lastmod>`;
};

export const buildUrlsetXml = (entries: SitemapUrlEntry[]): string => {
  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastModTag(
          entry.lastModified
        )}\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const buildSitemapIndexXml = (locs: string[]): string => {
  const sitemaps = locs
    .map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
};

export const XML_RESPONSE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "X-Robots-Tag": "noindex",
} as const;
