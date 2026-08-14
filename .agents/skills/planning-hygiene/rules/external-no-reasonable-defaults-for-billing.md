---
title: No Reasonable Defaults for Billing-Adjacent Values
impact: HIGH
impactDescription: prevents silent overcharges, undercharges, and wrong-model API calls
tags: planning, billing, vendor-api, model-id, external-source-of-truth
---

## No Reasonable Defaults for Billing-Adjacent Values

When a value the code uses is owned by an external vendor — model identifier, price per unit, rate-limit threshold, region endpoint — there is no such thing as a "reasonable default." Either it matches the vendor's current published value, or it's a silent bug. Plug-in placeholders mean: a code path that quietly bills an account at the wrong rate, calls a deprecated/non-existent model ID, or routes to the wrong region.

**Incorrect — propose a default in a plan without sourcing it:**

```ts
// "I'll fill in reasonable defaults; user can adjust later."

export const PRICES_PER_SECOND = {
  fast: 0.01,    // ← did anyone verify this?
  standard: 0.05, // ← made up
};

const cost = PRICES_PER_SECOND.fast * durationSec;
```

```ts
// "Use the obvious model name."
const result = await openai.images.generate({
  model: "gpt-image-1",  // ← but the project uses gpt-image-2 everywhere else
  ...
});
```

Both bugs above shipped from the same root cause: writing the value before looking it up. The first miscalculates billing reports forever. The second yields a 404 or — worse — a successful call against an outdated model whose output silently differs from the rest of the app.

**Correct — search both the codebase AND the vendor docs, cite the source:**

```ts
// src/.../pricing.ts
//
// Source notes (recorded YYYY-MM-DD):
//   - Per-second base rates: https://docs.vendor.example/pricing
//     (page was JS-gated at the time of writing; falling back to the most-cited
//     third-party transcription that matches the activity-page wording).
//   - Resolution multiplier: vendor's launch page documents "up to ~1:1.8".
//
// Verify against a real invoice once the first call lands; update if >20% off.

export const PRICES_PER_SECOND = { fast: 0.01, standard: 0.03 } as const;
```

```ts
// For model IDs, prefer pulling from a project catalog over hard-coding:
import { getModelById } from "@/.../models";
const model = getModelById(modelId);
if (model?.provider !== "openai") return notFound();
const result = await openai.images.generate({ model: model.endpoint, ... });
```

Key points:
- Before writing a number, ask: "What real-world thing does this map to?" If the answer is "vendor pricing," "model identifier," "API endpoint," or "rate limit," it must be sourced — never guessed.
- The codebase is often a better source than third-party blogs. If another admin page already calls the same vendor API, look there first; the values have been verified by past production use.
- When the official vendor docs are gated/JS-rendered/private, transcribe the most-cited third-party version AND leave a comment explaining why the canonical source wasn't usable AND set up a verification cue (e.g., "diff against the first real invoice").
- Heuristic that flags the failure mode: if your plan or code review contains the words "reasonable default," "should be roughly," or "we can adjust later" attached to a billing/model/endpoint value, stop and source it instead.
- Especially watch for accidental version-skew bugs: if the project has used model X version 2 across all admin tools for months and you're typing X version 1 because that's what you remember, the codebase is right and your memory is wrong.
