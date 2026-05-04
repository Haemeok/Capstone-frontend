---
title: Enforce Output Structure in Post-Processing, Not the Prompt
impact: HIGH
impactDescription: removes flake from contract-critical output ordering
tags: llm, prompt-engineering, post-processing, determinism
---

## Enforce Output Structure in Post-Processing, Not the Prompt

When the structural shape of an LLM's output is contract-critical for downstream rendering — slot order, section order, mandatory fields — instructing the model to obey is unreliable across models, retries, and prompt drift. Adding more emphatic phrasing (`반드시`, `MUST`, capitals, repeated bullets) buys diminishing returns and stops working the moment you swap providers or the model gets a long context. Take ownership of the structure in code; let the model do the linguistic work.

**Incorrect — relying on the prompt to lock ordering:**

```ts
// System prompt
"## 슬롯 규칙 (엄수)",
"각 H2 섹션 안에 다음 슬롯이 등장:",
"  - {{yt:N}}    영상 — H2 첫 단락 직후",
"  - {{recipe:N}} 추천 링크 — 자연스러운 문장 끝",
"  - {{img:N}}    이미지 — 마지막 단락 직후",
"**순서: yt → recipe → img**. 영상이 항상 이미지보다 위에 와야 함.",
```

```ts
// Symptom band-aid that grows after each failure
const reorderYouTubeBeforeImage = (md: string): string => {
  // ...if yt below img inside an H2, swap two lines.
};

// Then: bug reports come in for ingredients/steps placement.
// Then: another swap helper. Then: another. Each one a "fix" for the
// model breaking the prompt's stated order in a new way.
```

The mechanism: an LLM's adherence to ordering is statistical. The prompt biases the distribution but doesn't constrain it. The first time you write a swap helper for one ordering pair, you've conceded the prompt isn't the source of truth — but only for that pair. Every other ordering relationship in the same output is still a coin flip until you give it the same treatment.

**Correct — single deterministic post-processor that owns the structure:**

```ts
// Prompt asks for slots, but doesn't try to lock ordering with capitals.
"각 H2 섹션 안에 {{yt:N}}, {{recipe:N}}, {{img:N}} 슬롯이 1회씩 등장.",

// Code owns the final layout. Parse → reassemble in a fixed order.
const enrichBody = (md: string): string => {
  const sections = splitByH2(md);
  return sections
    .map((section, i) => {
      const { yt, desc, recipeLinks, img } = parseSection(section);
      return [
        section.headerLine,
        yt,
        ...desc,
        `[ingredients](data:ingredients/${i})`,
        `[steps](data:steps/${i})`,
        ...recipeLinks,
        img,
      ]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n");
};
```

Key points:
- If the same prompt has produced the wrong order twice, stop tightening the prompt. Move ordering responsibility into code in one pass — partial fixes (single-pair swaps) are how this gets messy.
- A deterministic post-processor is also testable. Add ordering invariants as unit tests; the next refactor can't silently break the contract.
- The model still does the work it's good at (writing readable copy in the right H2 sections). The code does the work it's good at (mechanical layout).
- Heuristic: when you reach for a regex to swap two specific lines because "the model keeps doing it backwards", that's the signal to take full ownership of layout instead.
- Failure-mode signature: prompt instructions grow boldface and emphasis over time; helpers named `reorderXBeforeY`, `ensureZ`, `fixupW` accumulate next to the call site.
