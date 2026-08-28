---
title: Compare Instants, Not Time Zone Representations
prefix: test
trigger: A test compares an ISO 8601 date-time string containing a fixed UTC offset, while the production code formats dates in the runtime's local time zone.
---

## Symptom
A date-time test passes on a developer machine but fails on a CI runner. The expected value uses one offset, such as `+09:00`, while CI returns an equivalent UTC value such as `+00:00`. Node's local date getters follow the process or operating-system time zone, and CI runners commonly default to UTC. Different calendar dates and offsets can therefore represent the same instant.

## Recommended pattern
When the contract is the moment in time, parse both values and compare epoch milliseconds. Assert additional temporal invariants separately.

```ts
const submittedAt = submit.mock.calls[0][0].submittedAt;

expect(Date.parse(submittedAt)).toBe(Date.parse("2026-08-17T15:26:00Z"));
expect(Date.parse(submittedAt)).toBeLessThanOrEqual(Date.now());
```

Use an exact string assertion only when the offset or serialized representation is itself part of an external contract. In that case, set the test process time zone explicitly rather than relying on the runner default.

## Anti-pattern
```ts
jest.setSystemTime(new Date("2026-08-18T00:26:11+09:00"));

expect(submittedAt).toBe("2026-08-18T00:26+09:00");
```

The fake date fixes the instant, not the environment's local time zone. A UTC runner can correctly serialize that instant as `2026-08-17T15:26+00:00`, causing a false failure.

## Heuristic
- Ask whether the requirement is about an instant or its displayed/serialized offset. Compare epoch milliseconds for an instant.
- Reproduce local-only date failures with `TZ=UTC` before changing production code.
- Do not set the entire CI job to a developer's time zone merely to make an environment-dependent assertion pass.
