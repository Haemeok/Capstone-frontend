---
title: Environment Variables Through shared/config
prefix: policy
trigger: Reading `process.env.X` anywhere outside `shared/config/`.
---

## Symptom
Direct `process.env.X` access scatters env-var names. A typo (`NEXT_PUBLIC_API_URL` vs `NEXT_PUBLIC_API_BASE`) silently reads `undefined`; rename requires a project-wide grep; runtime validation never runs.

## Recommended pattern
```ts
// shared/config/env.ts — single source, validated once.
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  API_BASE: requireEnv('NEXT_PUBLIC_API_BASE'),
  ANALYTICS_KEY: process.env.NEXT_PUBLIC_ANALYTICS_KEY ?? '',
} as const;

// Consumers:
import { env } from '@/shared/config/env';
fetch(`${env.API_BASE}/...`);
```

## Anti-pattern
```ts
const url = `${process.env.NEXT_PUBLIC_API_BASE}/recipe/${id}`;
//          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ direct access — banned outside shared/config
```

## Heuristic
`grep "process.env" src/` should return only `shared/config/`. Anything else is a leak.
