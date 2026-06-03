# naming-ubiquitous-language

One domain concept gets **one word**, in the product owner's language, and that
same word appears everywhere: the slice's acceptance criteria, the code
identifier, and the test description. The shared word is what links a requirement
to its test — so you don't need ID tags or a traceability matrix to prove
coverage. The glossary is authored upstream in `vertical-slicing`; this rule is
the code-review-time backstop that keeps code and tests from drifting off it.

## Symptom

A reviewer can't tell whether two names mean the same thing. The spec said
"공유 토큰", the API types call it `slug`, one test says "share key", another
"share token". grep for the concept finds nothing because it has four spellings.
A requirement looks untested because its word never appears in any test name —
even though the behavior is covered under a different word.

## Recommended pattern

```ts
// glossary fixed in the slices doc: 공유 토큰 → shareToken
export type MealPlanShare = { shareToken: string };

// test description uses the same word the AC uses
it("공유 토큰이 없으면 '찾을 수 없는 식단'을 보여준다", () => { /* ... */ });
```

The AC ("공유 토큰이 잘못되면 …"), the field (`shareToken`), and the test name
all carry one word. Tracing the requirement is `grep shareToken`.

## Anti-pattern

```ts
// AC said "주간 식단", code silently translated, tests drifted again
export type WeeklyMenu = { slug: string };          // 식단→menu, 토큰→slug

it("invalid slug returns not found", () => { /* ... */ });  // third spelling
```

Silent translation (`주간 식단` → `WeeklyMenu`) and synonym drift
(`token`/`slug`/`key`) cut the trace line before the code even runs.

## Heuristic

- Before naming a domain type/field/test, check the slice's glossary. Same
  concept → reuse the exact word; don't invent a synonym because it "reads
  better in code."
- Don't silently translate the owner's term. If `주간 식단` must become an English
  identifier, pick one (`mealPlan`) and put it in the glossary as *the* word —
  then never also call it `weeklyMenu`.
- Quick self-check: pick a requirement, grep its glossary word. If the test that
  covers it doesn't contain that word, either the name drifted or the
  requirement is actually untested. Both are bugs.
