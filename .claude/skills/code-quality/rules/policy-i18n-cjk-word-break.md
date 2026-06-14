---
title: Don't Apply `word-break: keep-all` to Text That Can Render in Japanese/Chinese — It Forbids All Wrapping and Overflows
prefix: policy
trigger: Using `break-keep` (Tailwind) / `word-break: keep-all` on any width-constrained or `line-clamp`/truncated text in a multilingual (ko + ja/zh) UI — cards, chips, list rows, badges, anything that renders the same element across locales.
---

## Symptom

A localized text block (e.g. a card description) looks fine in Korean but in **Japanese** is clipped to a single overflowing line, or the element measures **wider than its fixed container** in devtools though it looks the same to the eye. Different items get different widths depending on text length. No error — it just renders cut off, and only in the space-less CJK locale.

## Root cause

Two CSS facts collide:

1. `word-break: keep-all` (Tailwind `break-keep`) forbids line breaks **within a "word"** — a run of non-break characters. Korean has spaces between eojeol, so it still wraps at spaces. **Japanese and Chinese have no spaces**, so the entire string is one unbreakable run — `keep-all` forbids breaking it _at all_.
2. `line-clamp-*` sets `display: -webkit-box`. A `-webkit-box` is **content-sized**: with nothing forcing a wrap, it grows to `max-content` (the full unwrapped line) and overflows its container. If an ancestor has `overflow-hidden` it's visually clipped to one truncated line; meanwhile the box's intrinsic width tracks the text length, so longer strings overflow more — which reads as "items have different widths" in devtools.

Default `word-break: normal` lets CJK wrap **between characters** (the correct CJK line-breaking behavior), which collapses `max-content` and lets `line-clamp` work.

**Incorrect — keep-all on clamped, locale-shared text:**

```tsx
// break-keep === word-break: keep-all
<p className="line-clamp-2 break-keep">{description}</p>
// ja: one unbreakable run → -webkit-box grows to max-content → overflows, clipped to 1 line
```

**Correct — let CJK wrap between characters:**

```tsx
<p className="line-clamp-2">{description}</p>
// default word-break: normal → ja wraps per-character, ko still wraps at spaces → both clamp to 2 lines
```

## Recommended pattern

- For text that can render in Japanese/Chinese, **don't apply `keep-all` unconditionally.** Drop it (default `normal` wraps all three locales acceptably), or make it **locale-conditional** — apply `keep-all` only for Korean, e.g. a CSS utility keyed on the document/ancestor language: `:lang(ko) .wrap { word-break: keep-all; }` with a `normal` default. That keeps Korean's nicer word-intact wrapping without breaking CJK.
- Keep `line-clamp` for a consistent line cap — it's not the bug; the bug is `keep-all` denying it any wrap point.

## Anti-pattern

- Treating `break-keep` as a default "nice Korean wrapping" class and sprinkling it everywhere. It's a **Korean-typography** choice; on space-less CJK it means "never wrap." Width-constrained + clamped + keep-all + Japanese = guaranteed overflow.
- "Add `line-clamp` to fix truncation" without checking word-break. `line-clamp` (`-webkit-box`) makes the box content-sized, so it _amplifies_ a keep-all overflow (turns a vertical clip into a horizontal one). Verify in the CJK locale, not just the default.
- Constraining the wrapper width (`min-w-0`, `minmax(0,1fr)`) to "contain" it — that bounds the box but the text still can't wrap under `keep-all`, so it stays one clipped line. Fix the word-break, not just the box.

## Heuristic

In a multilingual app, grep for `break-keep` / `word-break: keep-all` and inspect each hit that is also width-bounded or `line-clamp`/`truncate`. Each is a Japanese/Chinese overflow waiting to happen. The tell: "Korean fits, Japanese is cut to one line" or "the element is wider than its container in devtools though it looks identical." Verify wrapping by measuring `scrollWidth > clientWidth` on the CJK locale.

Related: word-break is one of several things that must flip by locale; see [[policy-i18n-chrome-vs-content-axes]] for the chrome-vs-content split and [[policy-container-layout]] for fixed-size containers that clip overflow.
