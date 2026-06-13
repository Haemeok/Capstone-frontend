---
title: Localize Labels That Double as Lookup Keys via a Code-Keyed Overlay, Not a Key Migration
prefix: policy
trigger: Localizing a taxonomy/enum constant whose source-language display string is simultaneously used as an object key, a piece of component state, a comparison value, or a reverse-map key into a backend code.
---

## Symptom

You need `ja`/`en` labels for a set of category/filter/enum constants, but the source-language string (e.g. Korean) is also the **key**: `CODE_BY_LABEL[label]`, the value held in form/filter state, the `selected === label` comparison, the value emitted on select, and sometimes the URL/query param. Translating the constant in place would break the lookups and the round-trip to the backend.

## Root cause

The constant conflates two roles in one string — **display** and **identity**. The backend contract is usually already code-based (`?sort=createdAt,DESC`, `?type=USER`), so the source-language string never crosses the network; it lives only in client state and in the rendered label. Migrating the canonical key to a stable code (option B) is architecturally cleaner but has a large blast radius: every consumer (state, URL builder, comparison, reverse map, drawer config) changes, and the source locale must be re-verified everywhere. On a working filter/taxonomy surface that risk usually isn't worth it.

## Recommended pattern

Leave the existing constant **byte-identical** (source string stays the canonical key; state, URL, comparison, reverse maps untouched). Add a _separate_ locale dictionary keyed by the **stable code**, and resolve display at the render site only.

```ts
// constants.ts — UNCHANGED. Source string still the canonical key.
export const SORT_CODE_BY_LABEL = { "인기순": "popularityScore,DESC", /* … */ };

// messages/{ko,ja,en}/taxonomy.ts — NEW dict, keyed by the stable code
export const taxonomy = { sort: { "popularityScore,DESC": "人気順", /* … */ } };

// resolver — maps a source-language value through its code to the locale label,
// and returns the input verbatim for the source locale OR when unmapped.
const localize = (sourceValue, domain, dict) => {
  const code = REVERSE_MAP[domain]?.[sourceValue] ?? sourceValue;
  return (dict[domain])[String(code)] ?? sourceValue; // ko dict holds the source string → identity
};

// render site — display only; state/emit/compare stay on the source value
<FilterChip header={localize(sort, "sort")} isDirty={sort !== "인기순"} />
```

When a render site already holds the **code** (not the source string), resolve it directly: `taxonomyLabel(code, domain, dict)` — no reverse map needed.

## Anti-pattern

- Migrating the canonical key to a code across all consumers just to "do it right" — large blast radius on working plumbing the task didn't ask to touch.
- Translating the constant in place — breaks `CODE_BY_LABEL[label]`, `selected === label`, and the backend round-trip.
- Localizing the value held in state instead of the value shown. Keep state/URL/comparison on the source value; localize the _displayed_ string only.

## Heuristic

Source-locale regression becomes **structurally impossible**: the resolver returns its input for the source locale (the source dict holds the source strings) and for any unmapped value. So the only files that change are render sites. If you find yourself editing a reverse-map, a `setState`, or a URL builder to localize a label, stop — you're migrating the key, not overlaying the display.
