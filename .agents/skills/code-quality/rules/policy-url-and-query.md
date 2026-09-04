---
title: URL Construction and Query Strings
prefix: policy
trigger: Building any URL with a path joined to a base, or any query string.
---

## Symptom
String-concat URLs forget slashes (`/api` + `users` = `/apiusers`), double them (`/api/` + `/users` = `/api//users`), or skip encoding (`?q=${input}` breaks on spaces, ampersands, special characters). The bug is silent in dev because the input is clean, and obvious in production because someone's name contains `&`.

Servers have the inverse failure mode when they compare `request.url` as though it only contained a path. A root request such as `/?preview=6` no longer equals `/`; code can then resolve it as a directory, return the wrong resource, or crash while reading it as a file.

## Recommended pattern
```ts
// URL composition
const url = new URL(`/recipe/${id}`, env.API_BASE);

// Query string
const params = new URLSearchParams({ q, page: String(page) });
const url = new URL(`/search?${params}`, env.API_BASE);

// Incoming server request
const requestUrl = new URL(request.url ?? '/', 'http://localhost');
const pathname = requestUrl.pathname;

// Typed builder preferred when available:
import { endpoints } from '@/shared/api/endpoints';
const url = endpoints.recipe.detail(id);
```

## Anti-pattern
```ts
const url = env.API_BASE + '/recipe/' + id;                // slash hazard
const url = `${env.API_BASE}/search?q=${query}&page=${p}`; // encoding hazard
const path = request.url === '/' ? '/index.html' : request.url; // query/path hazard
```

## Heuristic
If you typed `+` between URL parts, `?` followed by `${...}`, or compared raw `request.url` to a pathname, stop. Reach for `new URL` / `URLSearchParams`, and branch on the parsed `.pathname`.
