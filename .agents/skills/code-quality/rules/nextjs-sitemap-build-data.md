---
title: Paginate Build-Time Sitemap/Metadata Data; Never Fetch the Whole List at Once
prefix: nextjs
trigger: A sitemap.ts / generateSitemaps / generateStaticParams fetches an unbounded list, or the build hangs/times out on /sitemap/*.xml.
---

## Symptom

`next build` logs `Failed to build /.../sitemap/N.xml ... took more than 60 seconds. Retrying`, alongside socket errors (`UND_ERR_SOCKET: other side closed`) on a list endpoint. The sitemap may also ship **empty without failing**, because the fetch error is caught and returns `[]`.

## Root cause

A build-time route fetched the **entire** collection (tens of thousands of rows) in one request. As the dataset grows it crosses the origin/gateway (ALB) response timeout → the server closes the socket mid-stream → the route exceeds Next's `staticPageGenerationTimeout` (default 60s). It compounds: `generateSitemaps()` plus each chunk's `sitemap()` call the same heavy endpoint; if the fetch-cache write fails (response too large/slow to complete) every chunk re-fetches the whole list. A `try/catch` returning `[]` then hides the failure as a silently empty sitemap — a green build that still loses crawl coverage.

## Recommended pattern

Fetch **one page per chunk** from a paginated endpoint. If the response is a bare array with no total count, count chunks by looping until a short/empty page (out-of-range pages return `[]`):

```ts
const SIZE = 10000;
const MAX_CHUNKS = 50; // backstop against an unbounded loop; log if hit

export async function generateSitemaps() {
  let count = 0;
  for (let page = 0; page < MAX_CHUNKS; page++) {
    const rows = await fetchPage(page, SIZE); // GET /endpoint?page=&size=
    if (rows.length === 0) break;
    count++;
    if (rows.length < SIZE) break; // partial page = last page
  }
  return Array.from({ length: Math.max(count, 1) }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }) {
  const rows = await fetchPage(Number(await id), SIZE); // only THIS page
  return rows.map(/* … */);
}
```

## Anti-pattern

```ts
const all = await fetchEntireList();            // 40k rows in one request → timeout
const chunk = all.slice(id * SIZE, ...);        // …and re-fetched once per chunk
```

## Heuristic

- Any build-time fetch (sitemap, `generateStaticParams`, metadata) over a **growing** collection must be bounded/paginated. "It was fine at 3k rows" is a scale time-bomb, not a passing design.
- Bumping `staticPageGenerationTimeout` is a band-aid; the fix is per-page fetch.
- Caught-error-returns-`[]` makes failures invisible — a green build with empty sitemaps still loses SEO. Log it, don't just swallow.
- Measure the real endpoint first: `curl -w '%{time_total}s %{size_download}B\n' -o /dev/null "<url>?page=0&size=10000"` before assuming it's fast or slow.
