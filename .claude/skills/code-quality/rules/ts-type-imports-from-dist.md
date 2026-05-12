---
title: Don't Import Types from a Package's `dist/` Path
prefix: ts
trigger: Writing `import type { X } from "pkg/dist/..."` or any internal-looking path.
---

## Symptom
The type you want exists, but it isn't exported from the package's public entry. So you reach into `pkg/dist/...` or `pkg/lib/internal/...` and import it directly. The build works today. Then the package ships a minor version that reshuffles its dist tree — the moved or renamed file — and your import breaks with a cryptic resolution error. Worst case it silently resolves to a different shape and you ship a runtime mismatch.

This happens most with Next.js (`AppRouterInstance`, `NextRequest` internals), TanStack Query (cache internals), Drizzle (`PgDatabase` etc.), and any library where the public API exposes a hook/function but not its return type as a named export.

## Recommended pattern
Derive the type from the **public** function or hook using `ReturnType<typeof X>` / `Parameters<typeof X>`. The contract is whatever the public surface returns — version-stable.

```ts
import type { useRouter } from "next/navigation";
type AppRouterInstance = ReturnType<typeof useRouter>;
```

```ts
import type { useQueryClient } from "@tanstack/react-query";
type QueryClientInstance = ReturnType<typeof useQueryClient>;
```

```ts
import type { drizzle } from "drizzle-orm/postgres-js";
type DB = ReturnType<typeof drizzle>;
```

Works for parameters too:

```ts
import type { toast } from "sonner";
type ToastOptions = NonNullable<Parameters<typeof toast>[1]>;
```

## Anti-pattern
```ts
// ⚠️ internal path — moves between minor versions
import type { AppRouterInstance }
  from "next/dist/shared/lib/app-router-context.shared-runtime";

// ⚠️ same problem, different vendor
import type { QueryCache }
  from "@tanstack/react-query/build/modern/queryCache";
```

These compile today and may compile tomorrow. They will break, silently or loudly, on a version that doesn't promise their stability.

## Heuristic
- If your `import type { … } from "pkg/…"` path contains `dist`, `build`, `lib`, `internal`, `shared`, `_`: stop. Find the public function or hook whose return/parameter is this type and use `ReturnType` / `Parameters`.
- If the type genuinely isn't reachable from any public symbol, ask the package maintainer to export it — or write your own minimal structural type that matches the shape you care about.
- `grep -nE "from \"[a-z@][^\"]*/(dist|build|internal|_)[^\"]*\"" src/` should return zero hits for type imports.
