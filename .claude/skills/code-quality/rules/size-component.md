---
title: Component Size Limits
prefix: size
trigger: A React component file exceeds 100 lines, or you're about to grow one past 100.
---

## Symptom
Components past ~100 lines tend to mix presentation, fetching, and orchestration in a single function. Bugs hide in the seams: a change to error UI accidentally rerenders the data fetch; a new prop forces a useEffect rewrite. Reading the file requires holding too many invariants in your head at once. Reviewers stop reading at line 80 and approve out of fatigue.

## Recommended pattern
- ≤100 lines: keep.
- 100–150 lines: review SRP signals (hook count ≥5, cross-component prop drilling ≥2 levels, conditional render branches ≥3). If **two** trip, split.
- >150 lines: must split.

Common split seams:
- Data fetch / mutation orchestration → custom hook (`useXxx`)
- Conditional render branches → sibling components
- Repeated JSX blocks → presentational subcomponent

```tsx
// Before: one 180-line component
function RecipeDetail({ id }: Props) {
  const { data, isLoading } = useQuery({ /* ... */ });
  const update = useMutation({ /* ... */ });
  const [tab, setTab] = useState<'info' | 'reviews'>('info');
  // hooks, derived state, handlers, three render branches…
}

// After: orchestration in a hook, branches in subcomponents
function RecipeDetail({ id }: Props) {
  const { data, update, tab, setTab } = useRecipeDetail(id);
  if (!data) return <RecipeDetailSkeleton />;
  return tab === 'info'
    ? <RecipeDetailInfo data={data} onUpdate={update} />
    : <RecipeDetailReviews data={data} />;
}
```

## Anti-pattern
Splitting a 50-line component into five 10-line components because "small is good." That fragments the read; you now hop across five files to follow one screen. The 100-line bar exists because below it, the cohesion benefit usually outweighs the file-count cost.

## Heuristic
Ask: "When the feature changes, do these things change together?" If yes, keep them. If no, split. Line count is a lagging indicator, not the trigger.
