---
title: Remove Legacy Fields from Client Types First So the Backend Can Drop Them from the Wire
impact: HIGH
impactDescription: unblocks backend transitions that otherwise stall indefinitely
tags: client, api, typescript, migration, deprecation
---

## Remove Legacy Fields from Client Types First So the Backend Can Drop Them from the Wire

When a backend introduces a unifying signal (e.g. a `source: 'AI' | 'YOUTUBE' | 'USER'` enum that subsumes a pile of `isAiGenerated` / `isYoutube` booleans) it usually keeps the legacy fields in the response for compatibility. The transition window is meant to be temporary, but it ends only when the backend can prove that no consumer still reads the legacy fields. With both fields typed on the client, that proof is impossible to obtain — every grep, IDE find-usages, and PR review can miss one call site, and the backend team plays it safe and never drops the legacy. Months later the response is still shipping both. The fix is counter-intuitive: remove the legacy fields from the client's type definitions immediately, even while the backend still emits them. The compiler then enumerates every consumer for you, and once they are migrated to the new signal the backend gets a clean green light to drop the legacy from the wire.

**Incorrect — leave both fields typed and write dual-fallback code:**

```ts
type Recipe = {
  source?: "AI" | "YOUTUBE" | "USER";
  isAiGenerated?: boolean;     // legacy, still shipped during transition
  isYoutube?: boolean;         // legacy
};

// Some consumers branch on source:
const aiOne = recipes.filter((r) => r.source === "AI");

// Other consumers — including third-party widgets, log lines, and
// localStorage payloads — still read the legacy:
saveRecentlyViewed({ id: r.id, isAiGenerated: r.isAiGenerated });
const showAiRow = !r.isYoutube && r.isAiGenerated;
```

Both styles compile. There is no signal that a consumer is on the wrong side of the migration. Searching for `isAiGenerated` finds the boolean references, but it cannot prove there are no transitive ones (utility wrappers, prop drills through 4 components, etc). The backend team, having no proof of safety, leaves the legacy in the response. The transition stalls.

**Correct — drop the legacy from the type immediately and let the compiler enumerate the call sites:**

```ts
type Recipe = {
  source?: "AI" | "YOUTUBE" | "USER";
  // isAiGenerated / isYoutube intentionally removed even though the wire
  // still carries them — see migration plan dated YYYY-MM-DD.
};

// One derived helper per legacy boolean, single source of truth on `source`:
export const isAiRecipe = (r: { source?: Recipe["source"] }) =>
  r.source === "AI";
export const isYoutubeRecipe = (r: { source?: Recipe["source"] }) =>
  r.source === "YOUTUBE";
```

Now `recipes[0].isAiGenerated` is a TypeScript error at every call site, including the transitive ones the grep would miss. Migrate each one to `isAiRecipe(recipes[0])`. When `tsc --noEmit` is clean, the client provably reads only the new signal — and you can tell the backend team it is safe to drop the legacy from the response.

Key points:

- **Treat the type as the deprecation contract.** The wire is the implementation; the client's type is the public surface. Removing the legacy from the type is the explicit signal "we no longer depend on this", and the compiler enforces it. Keeping the legacy in the type, even with a `@deprecated` JSDoc, is opt-in and gets ignored.
- **The compiler beats grep at finding consumers.** Boolean-typed fields get destructured, spread, passed as props, and stored in localStorage — many of these chains are invisible to text search. Deleting the field surfaces every link in those chains in one TypeScript run.
- **Write the derived helper before deleting the field.** Otherwise every call site needs an inline condition, the migration commit balloons, and reviewers cannot tell what changed semantically. Order: add helper → remove field → fix the resulting compile errors with the helper → ship one focused commit.
- **Adapter at the fetcher boundary if some endpoints lag.** A common case is that one or two endpoints have not migrated yet (the recommendations or related-items API often trails). Do not re-add the legacy field to the type to accommodate them. Instead, add a one-function adapter at the fetcher (`rows.map(ensureSource)`) that derives the new field from the legacy values for that endpoint only. Tag the adapter with a comment so it can be removed in one diff once the backend catches up. The consumer code never sees the legacy.
- **Heuristic for code review.** A PR that adds `?? legacy` fallback or `legacy ?? new` reads as transitional, but it is actually a permanent stall — both fields stay alive in the type forever. Push back: pick one source of truth, delete the other, fix what breaks.
- **This is the same lesson as `client-confirm-response-shape-before-refactor`, one step later.** That rule says: confirm what the wire actually carries before refactoring types. This rule says: once you have confirmed and the new signal is the unifying one, remove the legacy from the type *first*, not last.
