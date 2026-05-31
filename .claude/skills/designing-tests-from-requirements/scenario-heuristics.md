# Scenario Heuristics

The catalog for step 2 (decompose each acceptance criterion into scenarios). Walk every category for every AC. The categories that don't apply, you discard *consciously* — that's different from never having considered them.

## The four lenses

### Happy path
The primary success case, with the most typical inputs.
- Prompt: "What does success look like for a normal, valid input?"

### Boundary / edge value
The values at the edges of each input's valid range. Bugs cluster here.
- Empty: `[]`, `""`, `0`, `null`, missing field
- Single: exactly one element (off-by-one in loops/merges)
- Many: 2, 3+ (does logic that works for a pair work for three?)
- Min / max: smallest and largest allowed
- First / last: ordering-sensitive positions
- Duplicate: the same value appearing twice
- Just-over / just-under a threshold
- Prompts: "What's the smallest valid input? The largest? What if it's empty? What if there are exactly two?"

### Error / failure
What the system does when things go wrong. Each is a distinct observable behavior, not an afterthought.
- Invalid input (wrong type, malformed, out of range)
- Missing dependency (no data, service down)
- Permission denied / unauthorized
- Not found
- Network / IO failure, timeout
- Conflicting state
- Prompts: "What are all the ways this can fail? For each, what should the user observe — an error message, a 404, a no-op?"

### State / sequence
Behavior that depends on history or concurrency.
- Idempotency: doing it twice == doing it once?
- Ordering: does A-then-B differ from B-then-A?
- Concurrency: two actors at once
- Transitions: which state changes are legal, which are rejected?
- Prompts: "Does calling this twice break anything? Does order matter? What if two users do it simultaneously?"

## Classic techniques behind the lenses

- **Equivalence partitioning** — group inputs that should behave identically; one representative test per partition (don't write 50 tests for 50 valid emails).
- **Boundary value analysis** — test the edges of each partition, where off-by-one lives.
- **Error guessing** — enumerate the failure modes a hostile or careless user would hit.
- **State transition testing** — model legal/illegal transitions for stateful features.

## How many scenarios per AC?

Enough to pin the behavior, no more. A pure passthrough AC might be one happy + one empty. An AC with units, thresholds, and exclusion logic might be six. Let the lenses tell you — if a lens surfaces a genuinely different observable behavior, it earns a scenario. If it collapses to an already-covered case, drop it consciously.

## Worked example

**AC:** "Exclude an ingredient the user already has enough of in the fridge."

| Lens | Scenario |
|------|----------|
| Happy | recipe needs onion 2, fridge has onion 2 → onion omitted |
| Boundary | recipe needs onion 2, fridge has onion 1 → onion 1 remains (partial) |
| Boundary | recipe needs onion 2, fridge has onion 5 → omitted, never `onion -3` |
| Error | recipe needs milk 2 cups, fridge has milk 100 g → units don't cancel; line preserved |
| State | fridge match is case/whitespace-insensitive ("Onion" vs " onion ") |

Five observable behaviors from one criterion. A bottom-up "test the subtract function" approach would likely catch the first and miss the unit-mismatch and zero-floor cases — which are exactly the ones that bite users.
