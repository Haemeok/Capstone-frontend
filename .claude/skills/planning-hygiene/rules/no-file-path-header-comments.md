---
title: Never Write the File's Own Path as a Header Comment
impact: MEDIUM
impactDescription: prevents lying comments and pointless churn when files move
tags: comments, code-style, file-path, rot
---

## Never Write the File's Own Path as a Header Comment

A `// src/foo/bar/baz.ts` comment at the top of `src/foo/bar/baz.ts` is noise. It duplicates information the editor already shows, adds zero meaning, and turns into a lie the moment the file moves. Renaming or moving N files becomes "fix N comments" — pure churn that exists only because the comments were written.

**Incorrect — write the file's own path on line 1:**

```ts
// src/app/admin/video-studio/lib/seedanceAdapter.ts
import "server-only";

export const submitSeedanceTask = async (...) => { ... };
```

When this file moves to `src/app/api/bff/admin/video-studio/lib/seedanceAdapter.ts`, the header now lies. Either you do a follow-up edit on every moved file (the pattern that triggered this rule), or the comment rots silently and misleads future readers.

**Correct — let the path identify the file:**

```ts
import "server-only";

export const submitSeedanceTask = async (...) => { ... };
```

Or, if a leading comment genuinely earns its place (a real WHY about the module — not the path), put only the WHY:

```ts
// Server-only adapter for BytePlus ModelArk Seedance 2.0. The submit
// endpoint returns a task id that polling code consumes via fetchSeedanceTask.
import "server-only";
```

Key points:
- The project's CLAUDE.md says "Default to writing no comments. Only add one when the WHY is non-obvious." A path is never a WHY.
- Same rule applies to commit-time, plan-time, and review-time. If a plan template you're authoring shows files with `// path/to/file.ts` headers, drop those headers from the template before handing it to an implementer. Otherwise the implementer faithfully copies them in and the rot starts there.
- Heuristic: if your comment would be falsified by `git mv`, it's the wrong comment. Path comments, "used by FooComponent" comments, and "called from src/x/y.ts" comments all fail this test.
- Removing existing path-header comments is a cheap one-time cleanup. Don't perpetuate them just because a sibling file already has one.
