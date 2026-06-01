---
title: A Test Name Is a Spec, Not a Restatement
prefix: test
trigger: Writing a test name, or reviewing one that reads like a paraphrase of the function it calls.
---

## Symptom
`storeV2.test.ts:99` is named "updateJobProgress가 progress를 업데이트해야 함". Strip "해야 함" and what remains — "updateJobProgress가 progress를 업데이트" — is just the setter said twice. A name that only restates the call describes no contract, and the test under it is usually a pure getter/setter with no logic worth pinning ("set 50, read 50").

Contrast `jobStatusMapper.test.ts:5`: "returns completed when resultRecipeId is present, regardless of status". The name alone *is* the spec — you could delete the body and reconstruct it. The "regardless of status" clause encodes a real precedence rule.

## Recommended pattern
Name the **observable contract**, not the mechanism. Good names survive the strip-the-modal test:

```
✅ "preserves progress 0 (does not treat as nullish)"      // a real edge / bug class
✅ "returns failed when status is FAILED"                   // a branch with meaning
✅ "로그인 + direct + 미저장 → 자동 저장 1회"                  // a policy condition
✗ "updateJobProgress가 progress를 업데이트해야 함"            // setter restated
✗ "createJob이 job을 생성해야 함"                            // constructor restated
```

## Anti-pattern
Naming by `<함수명> + <동사> + 해야 함`. It guarantees the name carries no information the code doesn't already show, and it's a reliable marker that the assertion is trivial.

## Heuristic
- **Strip "해야 함 / should / 한다" from the name.** If a meaningful contract sentence doesn't remain, the test is a restatement — cut it or merge it into a behavior test that does carry a contract.
- If you can't name the behavior without naming the function, you're probably testing the function's existence, not its behavior. Ask what would be *observably wrong* if this were broken, and name that.
