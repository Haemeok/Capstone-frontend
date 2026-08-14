---
title: Resolve Opaque IDs to Names Before They Hit the Prompt
impact: HIGH
impactDescription: prevents hallucinated themes from ID-shaped inputs
tags: llm, prompt-engineering, hallucination, params
---

## Resolve Opaque IDs to Names Before They Hit the Prompt

When a user-facing query param is an opaque identifier (database ID, hashed slug, UUID), passing it into a prompt as-is gives the model nothing to reason about. The model silently ignores it and falls back to whatever readable signal is nearby — usually item titles. If two of five titles happen to share a word, the model declares that word the theme. The output looks coherent but is wrong, and the bug presents as "the search is broken" when the search is fine.

**Incorrect — opaque ID dumped into prompt:**

```ts
// search returns 5 items that all share ingredient id "NjeW51wD" (= 쪽파)
const items = await searchByIngredient({ ingredientIds: "NjeW51wD" });

const prompt = `
## params
${JSON.stringify({ ingredientIds: "NjeW51wD", maxCost: 10000 }, null, 2)}

## items
${items.map((it, i) => `[${i}] ${it.title}`).join("\n")}
`;
// Model sees an opaque ID, scans the 5 titles, finds 2 mention "토마토",
// writes a tomato-themed intro. The actual common ingredient (쪽파) never
// surfaces because the model has no way to know what NjeW51wD names.
```

The mechanism: LLMs route attention to readable tokens. An ID-shaped string is a single low-information token cluster the model treats as noise. The first nameable concept it can latch onto from the rest of the prompt becomes the theme.

**Correct — resolve in code, then label:**

```ts
const items = await searchByIngredient({ ingredientIds: "NjeW51wD" });

// Intersect items' fully-loaded data to recover human-readable common attributes.
const commonNames = findCommonIngredientNames(items); // ["쪽파"]

const prompt = `
## params
${JSON.stringify(originalParams, null, 2)}

## 이 큐레이션의 공통 재료 (모든 항목에 들어 있음, 실제 테마)
${commonNames.map((n) => `- ${n}`).join("\n")}
params의 ingredientIds 같은 ID 토큰은 의미 없는 식별자다. 위 공통 재료가
실재 테마이므로 인트로/결말은 위 재료를 중심으로 작성하고, 항목 제목에서
임의로 다른 테마를 추론하지 마라.

## items
${items.map((it, i) => `[${i}] ${it.title}`).join("\n")}
`;
```

Key points:
- IDs (UUID, nanoid, hash, FK) carry zero semantic content for an LLM. Resolve them on the server before composing the prompt.
- Resolution doesn't require an extra API call when the data is already loaded — intersect the items' own fields (ingredients, tags, categories) to recover the implied theme.
- After labeling, explicitly tell the model to ignore the ID-shaped fields. Without that nudge it still attends to them and may hedge.
- The smell to watch for: prompt embeds `JSON.stringify(params)` and one of the keys ends in `Id`/`Ids`/`Slug`/`Hash`. That's the leak point.
- Failure mode signature: search returns the right rows but the AI-generated copy describes a different theme; users say "your search is broken" when in fact the rendering layer is.
