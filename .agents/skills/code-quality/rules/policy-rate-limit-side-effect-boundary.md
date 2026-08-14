---
title: Enforce Rate Limits at the Side-Effect Boundary
prefix: policy
trigger: Persisting request attempts or applying minimum intervals and rolling quotas around an external API call.
---

## Symptom

Logs show correctly spaced request timestamps, but the real API calls start too close together or a rolling quota entry expires before the call actually happened. This appears when an attempt timestamp is captured before an awaited database or file write and is later reused as the request start.

## Recommended pattern

Persist a conservative quota reservation before the external side effect, then measure pacing immediately before starting the request. Extend the quota basis through completion so neither an orphaned attempt nor a slow response expires early.

```ts
const reservedUntil = addSafetyWindow(clock.now());
await attempts.append({ reservedUntil });

await pacer.waitUntilAllowed(clock.now());
const actualStartedAt = clock.now();
if (actualStartedAt > reservedUntil) return "reservation_expired";

pacer.markStarted(actualStartedAt);
const result = await gateway.request();
quota.markCompleted(maxDate(reservedUntil, clock.now()));
```

## Anti-pattern

```ts
const startedAt = clock.now();
await attempts.append({ startedAt });
pacer.markStarted(startedAt);
await gateway.request();
```

The awaited append can take most of the configured interval. The next call is then paced from a timestamp that predates the real side effect, and the same early timestamp can undercount a rolling quota.

## Heuristic

- Define "request start" at the last synchronous point before the owned gateway call.
- If an attempt must be durable before the call, reserve quota conservatively and refuse the call when recording outlives that reservation.
- Test with injected write latency and assert real gateway start times, not only stored event timestamps.
- For rolling windows, test orphaned attempts, slow completions, exact cutoff boundaries, and wall-clock rollback.
