---
title: localStorage / sessionStorage Keys via Constants
prefix: policy
trigger: A magic string inside `localStorage.getItem` / `setItem` / `removeItem` (or sessionStorage equivalents).
---

## Symptom
Hand-typed storage keys diverge between writes and reads. `localStorage.setItem('auth_token', t)` paired with `localStorage.getItem('authToken')` is undetectable until production sign-in mysteriously logs the user out. Also: no canonical list of keys, so logout cleanup misses some.

## Recommended pattern
```ts
// shared/lib/storage-keys.ts
export const storageKeys = {
  authToken: 'auth.token',
  recentSearches: 'search.recent',
  draftRecipe: 'recipe.draft',
} as const;

// Consumers:
import { storageKeys } from '@/shared/lib/storage-keys';
localStorage.setItem(storageKeys.authToken, token);
const token = localStorage.getItem(storageKeys.authToken);
```

## Anti-pattern
```ts
localStorage.setItem('auth_token', token);
const t = localStorage.getItem('authToken');  // typo ≠ write key, fails silently
```

## Heuristic
`grep -nE "(local|session)Storage\.(getItem|setItem|removeItem)\(['\"]"` finds violations.
