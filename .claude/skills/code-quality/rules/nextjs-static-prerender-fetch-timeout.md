---
title: Wrap Build-Time Page Fetches in a Timeout + Error-Safe Helper; Suspense Won't Save Static Generation
prefix: nextjs
trigger: A statically-prerendered route (home/landing) awaits one or more external fetches and the build hangs/times out, or you reach for <Suspense> expecting it to let the build "skip" a slow fetch.
---

## Symptom

`next build` stalls or logs `took more than 60 seconds. Retrying` on a **statically-prerendered** page (home, landing) right after you add server-side data fetches for a few sections. One slow or down upstream endpoint blocks the page's entire HTML, even though the other sections are ready. Wrapping the slow section in `<Suspense>` doesn't help — the build still waits.

## Root cause

A statically-prerendered route must **fully resolve every awaited fetch — and every `<Suspense>` boundary — before it can emit the cached HTML**. Static generation has no "stream the shell now, fill in later": that's a runtime/on-demand behavior, not a build behavior. So:

- Awaiting N external fetches at the top of the page (or via N async child server components) means the build waits for the **slowest** of them.
- `<Suspense>` does **not** let static generation skip a slow child — at build time it resolves the boundary too. Suspense only buys streaming on the **on-demand / dynamic** render path (a real visitor hitting an uncached page).
- The platform `fetch` has **no client-side timeout**. A hung connection waits until the gateway/socket gives up — or never — so a single dead endpoint can hang the whole build.

This is the same family as a sitemap timing out (`nextjs-sitemap-build-data`), but the trigger here is **endpoint count × tail latency**, not an unbounded list.

## Recommended pattern

Route every build-time fetch through one shared helper that bounds it with an `AbortController` timeout and returns a typed fallback on **any** failure (non-ok, network reject, abort). Then gate empty results so a fallback renders nothing instead of broken UI.

```ts
type SafeFetchOptions<T> = {
  revalidate: number | false;
  tags: string[];
  fallback: T;
  timeoutMs?: number;
};

export const safeFetchJson = async <T>(
  url: string,
  { revalidate, tags, fallback, timeoutMs = 8000 }: SafeFetchOptions<T>
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate, tags },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback; // reject + abort both land here
  } finally {
    clearTimeout(timer);
  }
};
```

```tsx
// Section renders nothing when the fetch fell back to empty.
const { content } = await getSectionData(locale); // uses safeFetchJson, fallback { content: [] }
if (content.length === 0) return null;
return <Section items={content} />;
```

## Anti-pattern

```tsx
// Static page: a bare top-level fetch with no timeout — one slow upstream hangs the build.
const data = await fetch(url).then((r) => r.json());

// And this does NOT rescue a static build — the boundary still resolves at build time.
<Suspense fallback={<Skeleton />}>
  <SlowAsyncServerSection />
</Suspense>;
```

## Heuristic

- **Know your render mode before trusting Suspense for latency.** On-demand/dynamic route → per-item `<Suspense>` genuinely streams (shell first, slow items fill in for the first visitor). Statically-prerendered route → Suspense gives you nothing at build time; the timeout-safe fetch is what protects you.
- Put the timeout **on the fetch** (`AbortController`), not on `staticPageGenerationTimeout` — bumping the build timeout is a band-aid that just moves the hang.
- Every added awaited external fetch on a static page raises build-hang exposure. Treat "the Nth section fetch" as a scale risk, not free.
- Caught-error-returns-fallback must be paired with a **hide-empty gate**, or a failed/slow endpoint ships an empty section instead of disappearing.
- Sibling server components await **in parallel**, so N fast fetches ≈ one fetch of wall-clock — the danger is the slow/dead one, which the per-fetch timeout caps.
