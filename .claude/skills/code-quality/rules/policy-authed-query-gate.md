---
title: Gate Authed Queries With enabled, Not Conditional Render
prefix: policy
trigger: Authoring a useQuery/useInfiniteQuery whose endpoint needs a login session (/me/*, /notifications, …), or hiding a data-driven component behind a login check.
---

## Symptom

Anonymous and session-expired visitors fire authed API calls anyway, and the backend drowns in 401s (real incident: ~100k 401s in 2 days from /me/recipe-books, /api/notifications, /me/calendar). The UI looked gated — components returned `null` for logged-out users — but the requests still went out.

## Mechanism (why the render gate doesn't work)

1. **Hooks run before the early return.** `if (!user) return null` hides pixels, not requests — the query hook above it already executed.
2. **A failed query is permanently stale.** TanStack Query refires errored queries on every remount and window focus (in a WebView app: every foreground return), so one ungated hook becomes a 401 drip per visitor.
3. **Default retry multiplies it.** A global `retry: 1` doubles every 401 — retrying an auth failure can never succeed.

## Recommended pattern

Gate at the query level with `enabled` derived from the auth store (`useAuthGate()` = `isAuthReady && isAuthenticated`, driven by the `/me` probe). This also gives "pause everything while /me is failing, auto-resume when it succeeds" for free — no circuit breaker layer needed.

```tsx
// widgets/features/app layer: gate inside the hook (importing entities/user is legal)
const authGate = useAuthGate();
useQuery({ queryKey: ["userStreak"], queryFn: getUserStreak, enabled: authGate });

// entities layer hook (FSD: cannot import entities/user — same layer):
// take enabled as a REQUIRED param so a missed call site is a compile error
export const useRecipeBooks = ({ enabled }: { enabled: boolean }) => …

// call site
useRecipeBooks({ enabled: useAuthGate() });
```

Global retry must skip 401s: `retry: (count, err) => !ApiError.isUnauthorized(err) && count < 1` (`shouldRetryQuery` in `shared/lib/queryClient.ts`).

## Anti-pattern

```tsx
const Badge = () => {
  const { unreadCount } = useNotificationsQuery(); // fires for everyone
  const { user } = useUserStore();
  if (!user) return null; // hides UI only — request already sent
```

```ts
enabled?: boolean // optional with `?? true` fallback — a forgotten call site
                  // silently fires ungated; required param makes tsc the sweep
```

## Heuristic

For every new query ask: "what does this endpoint return for an anonymous visitor?" If the answer is 401, the hook needs an auth gate; if it serves public data (like counts on /recipes/:id/status), do NOT gate it or anonymous UI breaks. Route protection and conditional render are never the gate — `enabled` is.
