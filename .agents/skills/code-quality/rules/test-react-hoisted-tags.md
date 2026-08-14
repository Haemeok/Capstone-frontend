---
title: Query the Document, Not the Container, for Hoisted Tags (React 19)
prefix: test
trigger: A Testing-Library test asserts a component rendered a <script src>, <title>, <meta>, or <link rel="stylesheet"> and the assertion against `container` finds nothing.
---

## Symptom

A component conditionally renders `<Script src=… />` (or `<title>` / `<meta>` / a stylesheet link). The RTL test queries `container.querySelector('script[src*="…"]')` and gets `null`, so the test fails even though the component clearly renders the tag. Adding `async` or swapping the `next/script` mock doesn't help.

## Root cause

React 19 **hoists** certain resource/metadata tags — `<script src>`, `<title>`, `<meta>`, `<link rel="stylesheet">` — out of the component's subtree into `<head>`. They never appear under the RTL `container` (the render-root div); they live in `document.head`.

## Recommended pattern

Query the whole `document` for hoisted tags, and clean them up between tests (they sit outside the unmounted subtree):

```tsx
const adScript = () => document.querySelector('script[src*="adsbygoogle"]');

afterEach(() => {
  document
    .querySelectorAll('script[src*="adsbygoogle"]')
    .forEach((node) => node.remove());
});

it("injects the script when enabled", () => {
  render(<AdScript />);
  expect(adScript()).not.toBeNull(); // found in <head>, not container
});
```

## Anti-pattern

```tsx
const { container } = render(<AdScript />);
expect(container.querySelector("script")).not.toBeNull(); // ← always null; React 19 hoisted it to <head>
```

## Heuristic

- Asserting a `<script src>` / `<title>` / `<meta>` / stylesheet from a render test? Scope the query to `document`, not `container`.
- Negative assertions (tag absent when disabled) also belong on `document` — a `container` check passes for the wrong reason (it's empty regardless).
- Hoisted tags persist in `<head>` across renders; add an `afterEach` cleanup so one test's tag doesn't leak into the next.
