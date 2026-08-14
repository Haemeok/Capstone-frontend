---
title: Function Complexity Limits
prefix: size
trigger: A function exceeds 30 lines, or any of branch / nesting / await / verb-pair flags trip.
---

## Symptom
Long functions are doing too much. The reader has to hold the entire control flow in working memory. Bugs hide in the third nested if-branch; reviewers approve by signature without reading the body. Past ~50 lines or 4 branches, refactoring becomes a "rewrite or leave alone" decision and rarely the former.

## Recommended pattern
- ≤30 lines: keep.
- Hard split when **any** of:
  - `if` / `switch` / early-return branches ≥ 4
  - nesting depth ≥ 3
  - verb-paired name (`doAAndB`, `fetchAndValidate`) — split on the conjunction
  - `await` count ≥ 3 (usually different concerns sharing a stack frame)

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
The verb in the name should describe one thing. If you cannot name the function without a conjunction ("and", "then", "with"), you have at least two functions.
