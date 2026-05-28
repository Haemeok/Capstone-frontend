import { createHash } from "node:crypto";


const SITE_HOST = "recipio.kr";

export type RssChannelMeta = {
  title: string;
  description: string;
  link: string;
  selfUrl: string;
  language?: string;
  copyright?: string;
};

export type RssItem = {
  guid: string;
  title: string;
  link: string;
  description?: string;
  pubDate: Date;
  imageUrl?: string;
};

const escapeXml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cdata = (s: string): string => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

const toRfc822 = (d: Date): string => d.toUTCString();

export const tagUri = (type: "recipe" | "curation", id: string, year = 2026): string =>
  `tag:${SITE_HOST},${year}:${type}/${id}`;

const renderItem = (item: RssItem): string => {
  const parts = [
    `      <title>${cdata(item.title)}</title>`,
    `      <link>${escapeXml(item.link)}</link>`,
    `      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>`,
    `      <pubDate>${toRfc822(item.pubDate)}</pubDate>`,
  ];
  if (item.description) {
    const body = item.imageUrl
      ? `<p><img src="${escapeXml(item.imageUrl)}" alt="${escapeXml(item.title)}" /></p>${item.description}`
      : item.description;
    parts.push(`      <description>${cdata(body)}</description>`);
  }
  return `    <item>\n${parts.join("\n")}\n    </item>`;
};

export const buildRssFeed = (
  channel: RssChannelMeta,
  items: RssItem[],
): string => {
  const lastBuildDate = items.length > 0 ? items[0].pubDate : new Date();
  const language = channel.language ?? "ko-kr";

  const head = [
    `    <title>${cdata(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${cdata(channel.description)}</description>`,
    `    <language>${language}</language>`,
    `    <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(channel.selfUrl)}" rel="self" type="application/rss+xml" />`,
  ];
  if (channel.copyright) {
    head.push(`    <copyright>${escapeXml(channel.copyright)}</copyright>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
${head.join("\n")}
${items.map(renderItem).join("\n")}
  </channel>
</rss>
`;
};

export const createRssResponse = (
  request: Request,
  xml: string,
  lastModified: Date,
): Response => {
  const etag = `"${createHash("sha1").update(xml).digest("hex").slice(0, 16)}"`;

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag },
    });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=21600, stale-while-revalidate=86400",
      ETag: etag,
      "Last-Modified": lastModified.toUTCString(),
    },
  });
};
