---
title: Isolate Volatile Fetches from Static Routes
impact: HIGH
impactDescription: preserves the intended static route cache lifetime
tags: server, nextjs, app-router, caching, revalidation
---

## Isolate Volatile Fetches from Static Routes

In a statically rendered App Router route, a short `revalidate` value in a nested Server Component can lower the revalidation interval of the whole route. A small, frequently changing widget can therefore make otherwise stable page data and HTML regenerate far more often than intended.

**Incorrect — a volatile child controls the static route cadence:**

```tsx
const RecentActivity = async () => {
  const activity = await fetch("https://api.example.com/activity", {
    next: { revalidate: 60 },
  }).then((response) => response.json());

  return <ActivityList activity={activity} />;
};

const ProductPage = async () => {
  const product = await fetch("https://api.example.com/product", {
    next: { revalidate: false },
  }).then((response) => response.json());

  return (
    <>
      <ProductDetail product={product} />
      <RecentActivity />
    </>
  );
};
```

The stable product route now participates in the shorter revalidation schedule introduced by the nested activity fetch.

**Correct — fetch non-SEO volatile content on the client:**

```tsx
"use client";

const RecentActivity = ({ productId }: { productId: string }) => {
  const { data } = useQuery({
    queryKey: ["activity", productId],
    queryFn: () => fetchActivity(productId),
  });

  return data ? <ActivityList activity={data} /> : <ActivitySkeleton />;
};
```

**Correct — keep current server-rendered content on a separate route:**

```tsx
const ActivityPage = async () => {
  const activity = await fetch("https://api.example.com/activity", {
    cache: "no-store",
  }).then((response) => response.json());

  return <ActivityList activity={activity} />;
};
```

Key points:

- Check the cache requirements of the parent route before adding a server fetch to any nested component.
- Use a client query for volatile content that does not need to be present in the initial HTML.
- Put current server-rendered lists on a separate dynamic route when their freshness requirement differs from the stable detail page.
- A `Suspense` boundary changes streaming behavior, not the nested fetch's effect on static route revalidation.
