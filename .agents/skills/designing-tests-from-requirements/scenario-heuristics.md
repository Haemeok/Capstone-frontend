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

## Owner layer for non-code artifacts (SKILL.md, system prompts, agent instructions)

When the unit under test is an LLM-facing instruction document (a SKILL.md, a tool prompt, an agent system message), the traditional unit / integration / E2E layer split does not apply. There is no function to import — the "implementation" is text the model reads. Picking the wrong layer here typically means writing tests that look rigorous but verify nothing.

Use these three layers instead:

| Layer | What it checks | Cheap to run? | When it's the owner |
|---|---|---|---|
| `static` | The instruction text itself — frontmatter present, required sections exist, glossary terms appear, banned synonyms absent. grep / lint script. | Yes (bash one-liner) | Structural invariants that have nothing to do with model behavior (e.g. "SKILL.md must declare `license`"). |
| `behavioral` | Invoke the skill / send the prompt in a real session, observe the model's response and tool calls against a known input. | Medium (1–3 min per run, manual or scripted) | Most ACs: the gate fires, the right next skill is invoked, the artifact has the right shape, the model refuses the adversarial ask. |
| `subagent-eval` | Dispatch a fresh subagent with a curated input and observe its tool-call log or output. Used when isolation matters — e.g. confirming the agent does NOT silently call a tool, or that fresh context produces the same read-off as a contaminated one would not. | Medium-high (variable; LLM stochasticity) | Negative-space behaviors ("does NOT auto-invoke X"), context-isolation tests ("reader-test subagent received only `## Draft` and nothing else"), and adversarial probes. |

Anti-patterns when testing instruction documents:

- **Mocking the LLM.** Replacing the model with a stub means you're testing your stub, not the instruction. If you can't afford behavioral runs, use `static` checks that catch the upstream cause (e.g. missing instruction text), not a fake of the downstream effect.
- **Asserting on natural-language output verbatim.** `expect(response).toBe("Thesis 결정 끝. 다음은...")` is a change-detector — the model will paraphrase. Assert on observable structural outcomes (file created at path X, frontmatter `status: thesis`, Skill tool invoked with name `writing-outline`).
- **Counting tokens as a behavioral signal.** Length is a proxy for nothing useful; don't write `assertTokensLessThan(N)` tests on instruction outputs.
- **Putting every adversarial scenario into a separate test ID.** A SKILL.md chain easily generates 40+ "T-xx" entries (one per adversarial probe per gate). Most will never get run manually and the matrix becomes a graveyard. Prefer grouping adversarial probes by gate ("all sign-off-gate adversarial cases for skill X") and running them as a single behavioral runbook entry; reserve separate IDs only for the probes that catch genuinely distinct failures.

Owner-layer rule of thumb for these artifacts: **structural invariants → `static`; gate / handoff / refusal behavior → `behavioral`; negative-space ("does NOT happen") and context-isolation → `subagent-eval`**. Never test the same behavior at two layers unless each layer catches something the other structurally cannot.
