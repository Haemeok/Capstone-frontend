---
title: Function Complexity Limits
prefix: size
trigger: A function exceeds 30 lines, or any of branch / nesting / await / verb-pair flags trip.
---

## Symptom
Long functions are doing too much. The reader has to hold the entire control flow in working memory. Bugs hide in the third nested if-branch; reviewers approve by signature without reading the body. Past ~50 lines or 4 branches, refactoring becomes a "rewrite or leave alone" decision and rarely the former.

## Recommended pattern
- Count nonblank lines in a non-component function body. React component bodies follow [component size](size-component.md).
- ≤30 lines: no size-driven split.
- Review responsibility boundaries above 30 lines or when any of these appear:
  - `if` / `switch` / early-return branches ≥ 4
  - nesting depth ≥ 3
  - verb-paired name (`doAAndB`, `fetchAndValidate`)
  - `await` count ≥ 3

Split when the review identifies independently meaningful responsibilities, not merely because a count trips. A cohesive serial workflow may retain three awaits; a switch mapping one enum may retain four branches. Keep orchestration order visible rather than hiding each step in a trivial wrapper.

```ts
// Before: 'createRecipeAndNotify' with 4 awaits and 3 branches
async function createRecipeAndNotify(input: Input) { /* ... */ }

// After: split on the verb conjunction
async function createRecipe(input: Input): Promise<Recipe> { /* ... */ }
async function notifyRecipeCreated(recipe: Recipe): Promise<void> { /* ... */ }
```

## Anti-pattern
Splitting a 10-line function with a single `await` and two early returns. There's no concern boundary to honor — you'd just be jumping files for no benefit.

## Heuristic
Use names and counts to ask whether concerns change independently. A conjunction is a review signal, not proof of two responsibilities.
