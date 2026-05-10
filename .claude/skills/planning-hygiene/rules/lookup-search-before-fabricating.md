---
title: Search Before Fabricating Lookup Tables
impact: HIGH
impactDescription: prevents parallel/divergent catalogs that drift over time and waste planning effort
tags: planning, lookup-table, dry, codebase-search
---

## Search Before Fabricating Lookup Tables

When a plan calls for a new file shaped like a catalog — pricing, model registry, provider list, feature-flag map, anything keyed by a domain ID — the existing codebase frequently already has a table that encodes the same values. Authoring a parallel one is wasted effort during planning, and once both exist they drift.

**Incorrect — invent a new pricing module from scratch:**

```ts
// src/app/admin/video-studio/lib/pricing.ts (NEW — but parallel to existing)

export const OPENAI_IMAGE_PRICES = {
  "gpt-image-2-low": 0.006,
  "gpt-image-2-medium": 0.053,
  "gpt-image-2-high": 0.211,
};

export const estimateImageCost = (modelId, n) =>
  OPENAI_IMAGE_PRICES[modelId] * n;
```

The numbers above are correct *today*. But they're already encoded in `src/app/admin/image-quality-test/lib/models.ts` as `pricePerImage` on each `ModelConfig`. Two copies means six months from now an OpenAI price change updates one and silently leaves the other stale.

**Correct — read the existing catalog:**

```ts
// new code
import { getModelById } from "@/app/admin/image-quality-test/lib/models";

const model = getModelById(modelId);
if (!model) return notFound();
const cost = model.pricePerImage * n;
```

If the existing catalog's location is awkward (admin page A's lib reaching into admin page B), the right move is to lift the catalog up a layer once a third caller appears — *not* to fabricate a parallel one.

Key points:
- Before authoring any file that looks like `*Pricing.ts`, `models.ts`, `providers.ts`, `features.ts`, or any keyed-by-domain-id lookup, run a grep for the values themselves (not just the file name) — e.g., `grep "gpt-image-2"` or `grep "0.053"`. Hit-or-miss matters less than the search itself.
- If a similar table exists, your plan should default to extending it (or importing from it). Justify any decision to fork.
- If lifting the table to a shared location is the right move, propose that explicitly in the plan rather than silently duplicating.
- Heuristic that flags the failure mode: if your plan has the phrase "we'll add a constants file with..." and you haven't yet shown evidence that no such file already exists, stop and grep.
