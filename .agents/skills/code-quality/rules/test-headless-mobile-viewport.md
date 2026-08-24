---
title: Verify the CSS Viewport Before Trusting Headless Mobile Screenshots
prefix: test
trigger: A Windows headless Chromium/Edge screenshot requested below 500px appears to crop responsive content or shows identical element positions at multiple requested mobile widths.
---

## Symptom

A page captured with `--window-size=320,800` appears to lose the last grid columns. A 390px capture loses the same columns at the same x-coordinates, suggesting a responsive overflow regression even though component tests pass.

## Root cause

On Windows, headless Chromium-family browsers can keep a minimum internal CSS viewport near 500px while writing an image at the smaller requested width. The screenshot is cropped to 320px or 390px, but `window.innerWidth` remains larger. Comparing the PNG width alone therefore reports a layout bug that the browser never rendered at that viewport.

## Recommended pattern

Use the Chrome DevTools Protocol to set device metrics, then verify the runtime dimensions before judging the screenshot:

```ts
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 320,
  height: 800,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 320,
  screenHeight: 800,
});

const metrics = await cdp.evaluate(() => ({
  innerWidth: window.innerWidth,
  scrollWidth: document.body.scrollWidth,
}));

expect(metrics.innerWidth).toBe(320);
expect(metrics.scrollWidth).toBe(320);
```

Capture the screenshot only after `innerWidth` matches the intended CSS viewport. For overflow checks, compare `document.body.scrollWidth` and element bounding rectangles against that measured viewport.

## Anti-pattern

```powershell
msedge --headless=new --window-size=320,800 --screenshot=mobile.png $url
```

Treating `mobile.png` as a 320px CSS render is unsafe. The output bitmap can be 320px wide while the page was laid out at a wider minimum viewport and then cropped.

Adding production overflow classes based only on that cropped image compounds the mistake: the code changes even though runtime geometry was already correct.

## Heuristic

- Identical element x-coordinates at two requested mobile widths are an environment warning; measure `window.innerWidth` before touching CSS.
- A screenshot filename or bitmap width is not evidence of the CSS viewport.
- For responsive QA below the browser's native minimum window size, use `Emulation.setDeviceMetricsOverride` and record `innerWidth`, `body.scrollWidth`, and the target element rectangles together.
- If removing a proposed CSS fix does not change runtime geometry, discard the fix and correct the test harness.

