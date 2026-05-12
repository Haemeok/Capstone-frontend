---
title: TanStack Query Key Convention
prefix: policy
trigger: Authoring a new useQuery / useMutation / invalidate call.
---

## Symptom
Free-form query keys make fuzzy invalidation impossible. After a mutation you can't say "clear everything about this recipe" — you must enumerate every cached key by hand. Six months in, refetches go stale or stampede.

## Recommended pattern
Tuple shape: `[domain, subdomain, ...ids]`. First element is a fixed domain prefix; later elements narrow.

```ts
['recipe', 'detail', id]
['recipe', 'list', filters]
['recipe', 'comments', recipeId]

// Invalidation:
queryClient.invalidateQueries({ queryKey: ['recipe'] });         // all recipe queries
queryClient.invalidateQueries({ queryKey: ['recipe', 'list'] }); // just lists
```

## Anti-pattern
```ts
['recipe-detail', id]    // ← no fuzzy invalidation by domain
[recipeKey(id)]          // ← opaque; can't be matched as a prefix
['detail', 'recipe', id] // ← domain not first; prefix invalidation hits wrong things
```

## Heuristic
After a mutation, ask: "what should refetch?" If you can answer with a prefix, the key shape is right. If you have to enumerate, fix the shape before adding more.
