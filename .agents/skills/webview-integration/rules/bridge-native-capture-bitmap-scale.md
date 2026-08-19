---
title: Derive WebView Crop Coordinates From Captured Bitmap Dimensions
impact: HIGH
impactDescription: prevents offset or top-left-only exports when cropping an RN WebView screenshot
tags: webview, react-native, ios, view-shot, image-crop, pixel-ratio
---

## Derive WebView Crop Coordinates From Captured Bitmap Dimensions

A web page reports crop geometry in CSS pixels, while a native WebView screenshot is a device-scale bitmap. On iOS, `react-native-view-shot` can interpret requested capture `width` and `height` as UIKit points and then apply the screen scale when creating the PNG. Multiplying dimensions by `PixelRatio` before capture can therefore apply the scale twice. Cropping with those requested dimensions then selects only an enlarged top-left portion of the screenshot.

Treat the captured PNG as the source of truth. Read its actual pixel dimensions after capture, compare them with the viewport dimensions sent by the web page, and convert the DOM rectangle using the measured X/Y scale. Let the screenshot library capture the view at its natural size unless a separate, verified resizing requirement exists.

**Incorrect — assume requested dimensions equal PNG pixels:**

```typescript
const requestedWidth = viewport.width * PixelRatio.get();
const requestedHeight = viewport.height * PixelRatio.get();

const uri = await captureRef(webView, {
  width: requestedWidth,
  height: requestedHeight,
  format: "png",
});

const scaleX = requestedWidth / viewport.width;
const scaleY = requestedHeight / viewport.height;
crop(uri, {
  originX: rect.x * scaleX,
  originY: rect.y * scaleY,
  width: rect.width * scaleX,
  height: rect.height * scaleY,
});
```

The screenshot library may apply the native screen scale after receiving point dimensions, so the PNG can be larger than `requestedWidth × requestedHeight`. The crop math no longer describes the produced bitmap.

**Correct — measure the PNG and convert coordinate spaces once:**

```typescript
const uri = await captureRef(webView, {
  format: "png",
  result: "tmpfile",
});
const source = await ImageManipulator.manipulate(uri).renderAsync();
const scaleX = source.width / viewport.width;
const scaleY = source.height / viewport.height;
const originX = Math.floor(rect.x * scaleX);
const originY = Math.floor(rect.y * scaleY);

crop(uri, {
  originX,
  originY,
  width: Math.ceil((rect.x + rect.width) * scaleX) - originX,
  height: Math.ceil((rect.y + rect.height) * scaleY) - originY,
});
```

Key points:

- WebView DOM geometry and native bitmap pixels are different coordinate spaces. Convert at the boundary.
- The actual decoded PNG dimensions are authoritative; `PixelRatio`, screen dimensions, and capture options are only inputs.
- Use independent X/Y scales because the captured native view can include platform-specific sizing differences.
- Floor crop origins and ceil crop edges, then clamp them to the bitmap bounds so rounding does not cut off edge pixels.
- A saved image showing an enlarged top-left viewport region is a strong signal that device scale was applied twice.
