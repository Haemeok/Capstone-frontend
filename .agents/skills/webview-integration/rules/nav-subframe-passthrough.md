---
title: Pass Sub-Frame Loads Through the WebView Navigation Gate Unconditionally
impact: HIGH
impactDescription: prevents white-page external browser jumps from ad iframes, embeds, and tracker iframes loaded inside an RN WebView
tags: webview, react-native, navigation, iframe, adsense, security
---

## Pass Sub-Frame Loads Through the WebView Navigation Gate Unconditionally

When an RN WebView (or any embedded WebView) hosts a web page that mounts iframes — AdSense ads, YouTube embeds, social embeds, ad measurement trackers — those iframe loads fire the same `onShouldStartLoadWithRequest` (iOS) / `shouldOverrideUrlLoading` (Android) handler that user-driven main-frame navigations do. A gate that filters by URL/domain alone treats iframe loads as if the user clicked an external link: it routes them to the system browser. The result is a "white page" opening at app start (or whenever ads load), because ad iframe URLs aren't pages — they're tracker pixels or ad creative containers, which render as blank in a browser.

The fix is one signal: **frame type**. Iframes don't change the main page URL. Letting WebView handle them in place is always safe regardless of destination domain. Only main-frame navigations need domain-based routing — those are the only ones that can replace the visible page.

Two failure modes the naive gate produces:

1. **Ad/tracker iframe loads → external browser** — AdSense's measurement and creative iframes hit `googleads.g.doubleclick.net`, `2mdn.net`, `securepubads.g.doubleclick.net`, etc. Any of those that don't match your ad-domain regex fall through to the external-browser fallback and the user sees an empty page open in Safari/Chrome.
2. **Trying to fix it with a domain regex is whack-a-mole** — Google's ad infrastructure spans dozens of subdomains. Adding domains to a regex catches the current set; the next AdSense feature ships a new one and the bug returns.

**Incorrect — domain-only filtering, no frame-type check:**

```typescript
type Request = {
  url: string;
  navigationType: 'click' | 'other' | /* ... */;
};

const gate = (request: Request): boolean => {
  // Domain regex catches some ad URLs but always has gaps.
  if (isAdRedirect(request.url) && request.navigationType !== 'click') {
    return false;  // silent drop — doesn't help iframes that DON'T match the regex
  }

  if (isInternal(request.url)) return true;
  if (isOAuthDomain(request.url)) return true;
  if (isAllowedEmbed(request.url)) return true;

  // Fallback — opens system/in-app browser. THIS is where unmatched
  // ad iframes end up, producing the white page.
  WebBrowser.openBrowserAsync(request.url);
  return false;
};
```

The gate treats every navigation event identically. AdSense fires N iframe loads at startup. Each iframe load that doesn't match the ad regex falls through to the external-browser fallback. The user sees N blank pages briefly open and dismiss.

**Correct — sub-frame bypass first, main-frame filtering after:**

```typescript
type Request = {
  url: string;
  navigationType: 'click' | 'other' | /* ... */;
  isTopFrame: boolean;  // RN WebView 13+ guarantees this; iOS WKWebView and
                        // Android WebViewClient both supply it natively.
};

const gate = (request: Request): boolean => {
  // 0. Sub-frame loads always pass. Iframes do NOT change the main page URL,
  //    so handling them in-place inside the WebView is safe regardless of
  //    domain — ads, trackers, embeds, anything.
  //
  //    Use === false (not !isTopFrame) so an undefined value from a future
  //    native bridge regression falls through to priority 1+ instead of
  //    silently opening main-frame bypass.
  if (request.isTopFrame === false) {
    return true;
  }

  // 1+. Main-frame navigations only — these CAN replace the visible page,
  //    so domain checks matter here.
  if (isAdRedirect(request.url) && request.navigationType !== 'click') {
    return false;  // silent drop ad-domain top-frame hijack (rare but possible)
  }

  if (isInternal(request.url)) return true;
  if (isOAuthDomain(request.url)) return true;
  if (isAllowedEmbed(request.url)) return true;

  // Fallback for genuine main-frame external navigations (user clicked an
  // external link, social login, etc.) — these SHOULD open externally.
  WebBrowser.openBrowserAsync(request.url);
  return false;
};
```

Key points:

- **The gate's job is "should this URL replace the visible page?", not "is this URL on a known list?"** Iframes can never replace the visible page, so they're outside the gate's responsibility regardless of where they load from.
- **`isTopFrame === false` over `!isTopFrame`.** Type signatures may say `boolean` (required), but native bridges can drift. Explicit narrowing fails closed: an undefined `isTopFrame` falls through to your main-frame logic instead of unconditionally allowing every navigation. In a security-adjacent gate this matters.
- **Domain regexes are still useful as defense in depth, not as the primary filter.** Keep them for the rare case where AdSense or another script does main-frame redirect via `top.location` or `target="_top"`. Parse the URL hostname (don't match raw URL strings) to avoid false positives from query strings like `?ref=doubleclick.net` and prefix attacks like `attacker-doubleclick.net`.
- **Ad clicks (genuine `navigationType === 'click'` on a main-frame ad URL) still need to go external.** The fallback at the bottom of the gate handles this — letting them happen via `WebBrowser.openBrowserAsync` keeps the user on your site in the WebView and opens the advertiser in the system browser. No "trapped inside WebView" risk because main-frame external navigations route through the fallback, not through the sub-frame bypass.
- **The "answer is to gate by `navigationType !== 'click'` only" is wrong** — it lets script-driven main-frame navigation to arbitrary external URLs through, which is exactly the trap the user worries about. You need *both* signals: frame type AND navigation type. Frame type comes first because it's the cheaper and more decisive check.

This pattern applies to any RN WebView, WKWebView wrapper, Android WebViewClient, or Tauri webview that hosts arbitrary third-party scripts (ads, analytics, embeds). The frame-type signal is named differently per platform (`isTopFrame` in RN WebView, `isMainFrame` on WKNavigationAction, `isForMainFrame()` on Android `WebResourceRequest`) but the principle is identical.
