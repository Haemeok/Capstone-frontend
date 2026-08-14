---
title: Localizing Chrome Does Not Localize the Data Fetch — Plumb the Locale Through the Query, Not a Boundary Remap
prefix: policy
trigger: Adding a new locale to a list/search surface whose data hook (query key + fetch params) only special-cases one existing non-default locale.
---

## Symptom

A new locale's page shows translated **chrome** but the wrong-language **content**: the server-rendered first page is correct, then client-fetched next pages come back in the default language, and item links point to the default-locale route. No error; the first page even looks right.

## Root cause

UI chrome and fetched content are two independent localization axes. Wiring the dictionary localizes chrome; it does nothing to the data layer. If the result hook (`buildQueryKey` / `buildFetchParams` / `useResults`) only special-cases the one existing non-default locale (`locale === "ja" ? {lang:"ja"} : {}`), adding a second locale forces a shortcut: a **boundary remap to the default** (`const fetchLocale = locale === "en" ? "ko" : locale`). Now the server prefetch fetches `lang=en` but the client refetches `lang=ko`. The query key still matches (so hydration succeeds and page 0 shows the server's English), which **masks** the divergence until infinite-scroll page 2 fetches in the default language. The card-href builder receives the remapped default locale too, so links go to `/` instead of `/en/`.

## Recommended pattern

Plumb the new locale through the data layer as a first-class value the same way the existing non-default locale is plumbed — key suffix, fetch param, and href builder all get the real locale.

```ts
// ❌ remap the new locale to default at the data boundary
const fetchLocale = locale === "en" ? "ko" : locale;   // content + hrefs now default-lang
useResults(page, fetchLocale);

// ✅ widen the data hook to the real locale union and special-case all non-default locales
const buildFetchParams = (..., locale: Locale) =>
  ({ ...(locale === "ko" ? {} : { lang: locale }) });   // ja AND en carry lang
const buildQueryKey = (base, locale: Locale) =>
  locale === "ko" ? base : ([...base, locale] as const); // server & client compute identically
useResults(page, locale);                                // real locale → en cards link to /en/
```

## Anti-pattern

- Declaring "en search done" after the chrome reads English. Chrome ≠ content; verify the fetched results' language and the item hrefs separately.
- A boundary `locale === "new" ? "default" : locale` downcast to dodge widening the hook's type. It silently routes content and links to the default locale.
- Trusting page 0. Server prefetch + matching key make the first page look correct; the divergence only appears on a client-side refetch/next-page.

## Heuristic

When adding a locale to a list surface, ask "does the _fetch_ carry it, or only the _labels_?" Verify by paging past the SSR'd first page (results stay in-language) and clicking an item (href stays in-locale). A matching query key with a mismatched `lang` param is the tell — parity of the key is necessary but not sufficient; the fetch params must match too.
