---
title: Localize a Module-Level Validation Schema by Converting It to a Per-Render Factory
prefix: policy
trigger: A module-level zod/yup schema (or any validator) with literal error messages baked in needs locale-aware messages, and it is consumed via a resolver passed to a form library.
---

## Symptom

Validation messages are frozen in the source language because the schema is a module-level constant evaluated at import:

```ts
export const recipeFormSchema = z.object({
  title: z.string().min(5, "제목은 5자 이상 입력해주세요"),
  // …MSG.* literals baked in
});
// consumed as: useForm({ resolver: zodResolver(recipeFormSchema) })
```

There is no locale at module-load time, so the messages can't be localized in place.

## Root cause

The schema (and its embedded messages) is built **once at import**, before any request/locale context exists. The messages are values captured at construction, so they're stuck at whatever language the literals were written in. A typed Dictionary won't help — the strings never went through it.

## Recommended pattern

Convert the schema const into a **factory** that closes over the locale's message dict, build it **per render** with the active-locale messages, and memoize on the dict so the resolver reference is stable.

```ts
// config.ts — factory instead of const
export const buildRecipeFormSchema = (v: FormValidationDict) =>
  z.object({
    title: z.string().min(TITLE_MIN, format(v.titleMin, { min: TITLE_MIN })),
    // sub-schemas / superRefine move inside the closure too
  });

// optional back-compat for non-React importers (tests, server)
export const recipeFormSchema = buildRecipeFormSchema(messages.ko.validation);

// hook — build per render with the active locale, memoize for resolver identity
const { validation } = useFormDict(); // pathname-resolved locale
const schema = useMemo(() => buildRecipeFormSchema(validation), [validation]);
useForm({ resolver: zodResolver(schema) });
```

## Anti-pattern

- Rebuilding the schema inline on every render **without** `useMemo` — a new resolver reference each render makes the form library re-subscribe/re-validate and can thrash. (This is one of the legitimate `useMemo` cases: stabilizing a reference handed to an external system.)
- Post-processing error messages after validation (string-replacing the source-language output) — brittle and breaks on interpolation.
- Hardcoding numeric thresholds into the translated string. Keep `{min}`/`{max}` placeholders in the dict and interpolate with `format(template, { min })` so the numbers stay in code.

## Heuristic

Any validator whose messages are literals at module scope is un-localizable in place — the tell is `export const schema = z.object(...)` with string literals, consumed by `zodResolver(schema)` in a client hook. Make it `buildSchema(messages)`, build per render, `useMemo` on the message dict. Keep a `buildSchema(sourceMessages)` const export if module-level importers (tests, SSR) still need one.
