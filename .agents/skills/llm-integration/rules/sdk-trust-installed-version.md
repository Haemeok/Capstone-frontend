---
title: Verify the Installed AI SDK Version Before Acting on a "This API Was Removed" Hook
impact: HIGH
impactDescription: stops a validation hook from talking you into breaking working code
tags: llm, ai-sdk, versioning, tooling, false-positive
---

## Verify the Installed AI SDK Version Before Acting on a "This API Was Removed" Hook

Automated validation hooks (and your own training priors) often assume the *latest* major version of a library. When a hook fires `ERROR: generateObject was removed in AI SDK v6 — use generateText + Output.object instead`, it is asserting a fact about v6 that may be false for the version this repo actually installs. Acting on it blindly rewrites working code into a different API, diverging from every other call site and breaking at runtime. The hook is a prompt, not ground truth.

This repo pins `ai` to v5 (`5.0.x`), where `generateObject` / `generateText` from `"ai"` are the correct, supported structured-output APIs and are used in ~8 files (`app/actions/curation`, `grok`, `recipeBlog`, …). The v6 `generateText({ output: Output.object({ schema }) })` shape does **not** apply here.

**Incorrect — "migrating" because the hook said so:**

```ts
// Hook: "generateObject removed in v6, use generateText + Output.object"
import { generateText, Output } from "ai";

const { experimental_output } = await generateText({
  model,
  output: Output.object({ schema: itemsSchema }), // wrong API for v5 → runtime/type break
  prompt,
});
```

This compiles against an imagined v6 surface, contradicts the 8 existing v5 call sites, and fails because the installed package doesn't expose that shape. You traded working code for a hook's assumption.

**Correct — confirm the version, then keep the v5 API:**

```bash
# One command settles it. Don't argue with the hook — measure.
node -e "console.log(require('ai/package.json').version)"   # → 5.0.106
node -e "console.log(typeof require('ai').generateObject)"  # → function
```

```ts
import { generateObject } from "ai";

const { object } = await generateObject({ model, schema: itemsSchema, prompt });
```

Key points:
- A hook claiming "API X removed in vN" is a claim about vN. Before refactoring, check the **installed** version (`require('<pkg>/package.json').version`) and whether the symbol actually exists (`typeof require('<pkg>').X`). Cheap to verify, expensive to get wrong.
- Cross-check against existing call sites. If 8 files in the repo use the "removed" API and pass tests, the hook — not the codebase — is stale.
- A plain model **string** (`generateObject({ model: "deepseek/deepseek-v4-flash", … })`) routes through the Vercel AI Gateway via `AI_GATEWAY_API_KEY` in v5; you don't need a provider instance for gateway models. Don't let a hook push you off this either.
- Failure-mode signature: a `PostToolUse` validation block flags a library symbol as "removed in v<latest>" on a repo pinned below that major. Treat as false positive until measured; note the false positive in your reply so reviewers aren't alarmed.
