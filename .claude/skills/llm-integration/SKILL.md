---
name: llm-integration
description: LLM/AI integration prompt-engineering and post-processing patterns. Use when wiring server actions, prompts, or pipelines that call OpenAI/Anthropic/Grok/Solar via the AI SDK — to avoid hallucinated themes from opaque inputs and to enforce structural contracts the model can't reliably hold.
license: MIT
metadata:
  author: recipio
  version: "1.0.0"
---

# LLM Integration Patterns

Hard-won rules for wiring LLM-backed features (curation, blog post, image alts, etc.). Each rule names a specific failure mode that recurs when you trust prompts to do work that the surrounding code should be doing.

## When to Apply

Reference these when:
- Building or editing a server action that calls `generateText` / `generateObject` / `streamText`.
- Designing a prompt that accepts user-facing query parameters (filters, IDs, search params).
- A model output's structure (slot order, section order, slot count) is contract-critical for downstream rendering.
- Debugging "the model ignored my instruction" symptoms.

## Quick Reference

- `prompt-resolve-opaque-ids` — Resolve opaque DB IDs to human-readable names before they hit the prompt.
- `prompt-deterministic-postprocess` — Enforce structural ordering in post-processing code, not in prompt instructions.
- `sdk-trust-installed-version` — Verify the installed `ai` version before believing a hook that says an API was removed; this repo is v5 where `generateObject` is correct.

## Anti-pattern Watchlist

If you find yourself doing any of these, stop and reach for a rule above:

- Pasting `JSON.stringify(params, null, 2)` into a prompt without resolving ID-shaped values.
- Adding more emphatic capitalization (`MUST`, `**반드시**`, `엄수`) to a slot-ordering instruction the model has already broken twice.
- Writing a "skeleton example" in the prompt and relying on the model to mimic the order verbatim.
- Patching ordering bugs by swapping pairs of lines after the model returns (`reorderYouTubeBeforeImage`-style band-aids) — that's a hint to take full control of ordering in code.
