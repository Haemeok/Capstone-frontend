---
title: A Typed Dictionary Gates Missing Keys, Not Unextracted Literals
prefix: policy
trigger: Localizing a component tree against a typed message dictionary (every locale must satisfy a `Dictionary` type), then trusting "tsc passes + one render test" as proof the screen is fully translated.
---

## Symptom

A localized page (`/en/...`, `/ja/...`) renders with some chrome still in the source language, even though `tsc --noEmit` is clean and a "renders different text per locale" test passes. The leak is real user-visible text — a heading, an empty-state line, a status badge — that never got translated.

## Root cause

A typed `Dictionary` enforces that every locale supplies every **key**. It says nothing about whether every visible **string** was lifted into a key. An inline literal that was never extracted (`<h2>코멘트</h2>`) compiles fine — it isn't a dictionary lookup, so the type system has no opinion on it. A single representative render test (e.g. assert the ingredients header differs ko vs ja) proves the _one_ element it checks is wired; it cannot see the sibling literal three components over. Type-completeness and extraction-completeness are different properties, and only the first is machine-checked.

## Recommended pattern

After wiring a subtree to the dictionary, grep the subtree for source-language characters and triage every hit.

```bash
# ❌ relying on tsc + one render test to declare the tree "done"

# ✅ prove extraction-completeness by sweeping the actual files
git grep -nP "[\x{AC00}-\x{D7A3}]" -- 'src/widgets/Foo/ui/*.tsx' \
  | grep -vE "__tests__|className=|aria-label|<intentionally-deferred>"
# every remaining hit is either a key to extract or a documented DEFER/EXCLUDE
```

## Anti-pattern

- Treating "all dictionary keys are filled (tsc green)" as "the screen is fully translated." The unfilled-key axis is gated; the unextracted-literal axis is not.
- A lone per-locale render assertion on one element standing in for the whole tree. It catches a regression on _that_ element, not a literal that was never moved into a key.

## Heuristic

The type gate answers "is every key present?" — not "is every string a key?" Close the second axis with a character-class grep over the localized files (and a short allow-list of intentional DEFER/EXCLUDE), because nothing in `tsc` or a representative render test will flag a literal that was never lifted.
