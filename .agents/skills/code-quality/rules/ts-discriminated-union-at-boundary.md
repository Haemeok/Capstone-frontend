---
title: Discriminated Unions for Correlated Optional Fields
prefix: ts
trigger: A type has 3+ optional fields whose presence is governed by a `status`/`type`/`kind` discriminator.
---

## Symptom
A type collects optional fields whose presence is **correlated**: each appears only when some discriminator takes a specific value. Modeling them as plain `?` lets the type compile but pushes the correlation knowledge into every consumer. The cost shows up as a forest of defensive code in components: `job.message || "실패"`, `status.resultRecipeId ?? ""`, `code ?? "UNKNOWN"`. Each ternary masks an invariant the type already knew about but refused to express.

When the consumer is JSX, the defenses snowball — every conditional render needs its own narrow, every prop drill loses information, and the team eventually stops trusting the type and reads the backend docs to remember which field is set when.

## Recommended pattern
If **3+ optional fields** depend on the same discriminator, promote the shape to a discriminated union. The consumer narrows once with `switch` on the discriminator and TypeScript hands them the right fields with no `?`.

```ts
type Job = PersistedJob & (
  | { state: "creating";  progress: 0 }
  | { state: "polling";   progress: number }
  | { state: "completed"; progress: 100; resultRecipeId: string }
  | { state: "failed";    code: string; message: string }
);
```

If the backend ships the wide optional shape, translate at the boundary:

```ts
// model/jobMapper.ts
export const fromJobStatusResponse = (raw: JobStatusResponse): Job => {
  switch (raw.status) {
    case "COMPLETED":
      return { state: "completed", progress: 100, resultRecipeId: raw.resultRecipeId ?? "" };
    case "FAILED":
      return { state: "failed", code: raw.code ?? "UNKNOWN", message: raw.message ?? "실패" };
    case "IN_PROGRESS":
    case "PENDING":
      return { state: "polling", progress: raw.progress ?? 0 };
    default: {
      const _exhaustive: never = raw.status;
      throw new Error(`Unknown job status: ${raw.status}`);
    }
  }
};
```

The exhaustiveness check via `never` ensures a future enum variant won't ship as silent "polling" — it'll fail compilation.

Consumers stay clean:

```tsx
switch (job.state) {
  case "completed": return <Success recipeId={job.resultRecipeId} />;  // typed string
  case "failed":    return <Error message={job.message} />;            // typed string
  case "polling":   return <Progress value={job.progress} />;
  case "creating":  return <Spinner />;
  default: { const _: never = job; return null; }
}
```

## When NOT to do this
- Fewer than 3 optional fields, or fields with **no correlation** (`User { nickname?, profileImage? }` — both independently optional, no shared discriminator). Keep them as plain `?`.
- A field that's "always there but with a sensible default" — make it required in the client type and fill the default at the boundary, no union needed (`progress: number` defaulting to 0).

## Where validation belongs
- **Internal API, stable contract**: TS-only mapper. No zod.
- **Third-party API, user input, JSON.parse, localStorage**: parse with zod (or equivalent) at the boundary, then build the union from the parsed shape.

## Anti-pattern
```ts
type Job = {
  state: "creating" | "polling" | "completed" | "failed";
  progress?: number;
  resultRecipeId?: string;  // correlated with state="completed"
  code?: string;            // correlated with state="failed"
  message?: string;         // correlated with state="failed"
};

// every consumer:
{job.state === "completed" && job.resultRecipeId ? <Success ... /> : null}
{job.state === "failed" && (job.message || "실패")}
```

The type lets the wrong combination compile (`state: "completed"` without `resultRecipeId`). Bugs hide in invalid combinations; consumers carry the defensive weight forever.

## Heuristic
- Count optional fields on a type. ≥3 + correlated discriminator → discriminated union.
- Translation lives in **one** function at the API boundary. Stores hold the narrowed type; components see only the narrowed type.
- `switch` on the discriminator + `never`-typed default. The two together turn a future new variant into a compile error rather than a silent fall-through.
