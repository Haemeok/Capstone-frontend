---
title: A Mirror-Route File (or Status Board) Is Not Proof of Localization — Verify Against Code
prefix: policy
trigger: Scoping remaining i18n work from a status board / page list, or judging a page "done" because a `/ja`·`/en` mirror route file exists or a dictionary namespace was added.
---

## Symptom

A status doc (or your own mental model) says a page is 🔴 "not started," but the code shows it fully localized — or the inverse: a `/ja/<route>/page.tsx` exists so the page is assumed done, yet it still renders source-language text. Planning off the doc re-does finished pages and skips half-finished ones.

## Root cause

Two weak signals get mistaken for completeness:

1. **A mirror-route file existing.** `app/ja/foo/page.tsx` can be a bare re-export — `export { default } from "@/app/foo/page"`. That makes the URL resolve, but whether the page localizes depends entirely on the **underlying** component self-judging locale (a `use*Dict` hook reading `usePathname()`). A re-export with no locale-aware underlying component is a stub: it renders source-language content at `/ja`.
2. **A dictionary namespace existing.** `messages/{ko,ja,en}/foo.ts` being present proves keys were authored, not that the render tree consumes them (and not that every visible string was extracted — see `policy-i18n-type-gate-misses-unextracted-strings`).

Status boards drift from code the moment work lands without a board edit. The board is a planning hint, not ground truth.

## Recommended pattern

Audit by artifacts, never by the board, before scoping work:

```bash
# 1. Which mirror routes exist at all?
find src/app/ja src/app/en -name page.tsx

# 2. Bare re-export = stub-until-proven. Open it; confirm the UNDERLYING
#    page consumes a self-judging dict hook (use*Dict / useChromeLocale).
cat src/app/ja/foo/page.tsx        # `export { default } from ...` ?
git grep -n "use[A-Za-z]*Dict\|useChromeLocale" -- src/app/foo

# 3. Completeness signal = no source-language chars left in the render tree.
git grep -nP "[\x{AC00}-\x{D7A3}]" -- 'src/app/foo/**/*.tsx' | grep -v __tests__
```

A page is "done" only when (route resolves) ∧ (render tree wired to a dict) ∧ (no-Hangul grep clean, modulo documented DEFER/EXCLUDE).

## Anti-pattern

- Reading a `🔴`/`🟢` off the status board and scoping the next task from it without opening the code. (Recurring tell: the board itself accumulates `📋 board stale` notes — that is the signal to stop trusting it.)
- Counting `find … page.tsx` hits as "pages localized." A re-export route inflates the count with stubs.
- Marking a page done because its namespace file exists.

## Heuristic

Route-file and namespace existence prove the _plumbing was started_, not that _strings were translated_. The real completeness signal is a no-source-language grep over the actual render tree plus a wired dict hook; treat a bare re-export route as a stub until you've read the underlying page. Before any "remaining i18n" scope, re-derive status from code — the doc is a hint, the grep is the truth.
