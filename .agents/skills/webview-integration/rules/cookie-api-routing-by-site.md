---
title: Route Cookie-Authenticated APIs by Site Boundary
impact: HIGH
impactDescription: prevents authenticated API failures when production subdomains, localhost, Preview deployments, and WebViews use different cookie sites
tags: webview, nextjs, cookies, samesite, cors, bff, vercel
---

## Route Cookie-Authenticated APIs by Site Boundary

Cross-origin and cross-site are different boundaries. `https://www.example.com` and `https://api.example.com` are different origins but the same site, so a cookie scoped to `.example.com` with `SameSite=Lax` can accompany a credentialed API request. `http://localhost:3000` or `https://feature.vercel.app` to `https://api.example.com` is cross-site; CORS permission alone does not make the authentication cookie eligible for that request.

This matters when a Next.js BFF receives backend `Set-Cookie` headers and re-emits them from the frontend host. A host-only localhost or Preview cookie works through a same-origin reverse proxy, but it cannot authenticate a direct backend request. Forcing `Domain=.example.com` does not solve it: a localhost response cannot set a cookie for an unrelated domain, and a backend cookie still faces the cross-site `SameSite` context.

**Incorrect — treat every production-mode build as the production site:**

```typescript
const clientApiBaseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.example.com/api"
    : "/api";
```

Vercel Preview also builds with `NODE_ENV=production`. The preview browser then calls the backend cross-site and authenticated requests lose their `SameSite=Lax` cookies even when the preflight succeeds.

**Correct — choose by deployment site and preserve explicit BFF routes:**

```typescript
const resolveApiRouting = (deploymentEnvironment?: string) => {
  const isProductionSite = deploymentEnvironment === "production";

  return {
    clientApiBaseURL: isProductionSite
      ? "https://api.example.com/api"
      : "/api",
    shouldProxyOrdinaryApi: !isProductionSite,
  };
};

const resolveRequestBaseURL = (
  requestPath: string,
  clientApiBaseURL: string
) => (requestPath.startsWith("/bff/") ? "/api" : clientApiBaseURL);
```

Key points:

- `Domain` determines which request hosts may receive a cookie; `SameSite` determines whether the surrounding top-level site permits the cookie to be sent. Both must pass.
- Same-site subdomain calls still need `credentials: "include"` and a credentialed, explicit-origin CORS response because they are cross-origin.
- Keep localhost and Preview on a same-origin proxy unless those environments have their own same-site backend and cookie domain.
- A WebView loaded from the production HTTPS page has the page's production origin; an opaque `Origin: null` document does not share that guarantee.
- Route authentication/token rotation, cache invalidation, and server-secret operations through their explicit BFF paths even when ordinary REST requests go direct.
- Check every configuration surface that can register a rewrite. A static deployment file can silently restore a proxy removed from framework configuration.
