---
name: webview-integration
description: Lessons for the recipio Web (Next.js) ↔ RN WebView (recipio-app) integration. Covers navigation gate semantics, iframe vs main frame handling, ad script side effects in WebView, bridge protocol patterns, and cross-repo invariants that span both codebases. Reference when adding features that introduce iframes, third-party scripts, deep links, cookies, or new navigation flows.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Web ↔ RN WebView Integration

The recipio system has the Next.js web (`Capstone-frontend`) embedded as the surface of an RN/Expo WebView app (`recipio-app`). Same Next.js codebase serves both pure web and the in-app surface. Integration bugs almost always come from the seam between those two repos, where assumptions made in one don't hold in the other.

## When to Apply

Reference these guidelines when:
- Adding iframes, third-party scripts, ads, or any content that mounts arbitrary external resources.
- Modifying the WebView's navigation gate (`onShouldStartLoadWithRequest` / `shouldOverrideUrlLoading`) or its callers.
- Wiring new bridge protocols, deep links, or cookie flows between web and app.
- Debugging white pages, external browser jumps, or "stuck inside WebView" reports.

## Rule Categories

| Prefix | Topic |
|---|---|
| `nav-` | Navigation gate semantics — what to allow/block, frame-type checks |
| `bridge-` | postMessage / injectJavaScript bridge patterns (future) |
| `script-` | Third-party scripts (AdSense, analytics) loading inside WebView (future) |

## Quick Reference

### Navigation gate

- `nav-subframe-passthrough` — Sub-frame loads must always pass the navigation gate; only filter main-frame navigations by domain. Iframe loads don't change the visible page URL, so blocking them just creates white-page external jumps with no security benefit.

## How to Use

Read individual rule files for full context, code examples, and failure modes:

```
rules/nav-subframe-passthrough.md
```

Each rule contains: symptom → root cause → incorrect code → correct code → generalizable principle.
