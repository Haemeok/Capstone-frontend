---
title: Plan Sequential Dispatch for Subagents Sharing MCP-Backed Tools
impact: MEDIUM
impactDescription: avoids contention/lost work when N subagents try to drive one shared MCP server connection
tags: planning, subagents, mcp, parallelism
---

## Plan Sequential Dispatch for Subagents Sharing MCP-Backed Tools

MCP servers (Playwright, Vercel, Context7, Gmail, …) connect **once at the session level**, not per-subagent. When two or more subagents dispatched in parallel call the same MCP server, they queue on the same underlying connection. Best case: the runs serialize transparently and you paid for "parallel" wall time you didn't actually get. Worst case: tool calls interleave on shared state (browser tabs, OAuth flows, pagination cursors) and one or both runs produce corrupt or partial output.

Sequential subagents using a shared MCP server are safe. Parallel subagents using pure read-only tools (Glob, Grep, Read) or per-call HTTP (WebFetch) are also safe. The danger is the combination *parallel + shared MCP*.

**Incorrect — plan says parallel for 3 Playwright-backed data collectors:**

> Stage 2 (3사 병렬 서브에이전트). Task 2, 3, 4 are explicitly parallel.
> Dispatch in one message with 3 Agent calls.

At execution time the 3 subagents all reach for `mcp__playwright__browser_navigate` and contend on the single MCP-server browser session. The plan author assumed "different files → parallel-safe", which is true for the file system but ignores the shared MCP transport.

**Correct — classify each subagent's tools at plan time, then choose dispatch shape:**

```
Per subagent, list the tools it will use. Split into three buckets:
  A. Pure local + per-call HTTP (Glob, Grep, Read, WebFetch, Bash on local cwd)
     → safe to dispatch in parallel.
  B. MCP-backed (Playwright, Vercel CLI bridge, any mcp__* tool)
     → must dispatch sequentially because the MCP server is session-scoped.
  C. Shared mutable resources (same file, same DB connection)
     → must dispatch sequentially regardless of tool type.

If any subagent in the batch is in (B) or (C), serialize the whole batch.
The plan's stage description should say "sequential dispatch (shared MCP)"
so the executor doesn't second-guess at runtime.
```

For the 3-sites-via-Playwright case this means: one Agent call at a time, wait for each to report DONE, then dispatch the next. Same outcome, longer wall time, no contention risk.

Key points:
- MCP server scope is the **Claude Code session**, not the subagent. The subagent inherits the parent's MCP connections; they aren't a fresh per-subagent server.
- Wall-time "parallel" with shared MCP is usually a lie — the calls serialize at the transport layer, you just lose the ability to inspect each subagent's progress independently.
- The decision belongs in the plan, not at execution. If the plan says "parallel" and the executor downgrades to sequential to avoid contention, the plan was wrong. Fix the plan, not the execution.
- `mcp__plugin_playwright_playwright__*`, `mcp__plugin_vercel_vercel__*`, and any `mcp__*` namespace is a signal. Treat them as bucket B until proven otherwise.
- Pure subagent work (extracting labels from a local codebase with Glob/Grep/Read, generating JSON, writing files in disjoint paths) is safely parallel. Don't over-correct by serializing everything.
