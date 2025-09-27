import localFont from "next/font/local";

export const pretendard700 = localFont({
  src: [
    { path: "./fonts/Pretendard-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "Noto Sans KR",
    "Noto Serif KR",
    "sans-serif",
    "Apple SD Gothic Neo",
    "Segoe UI",
    "Roboto",
  ],
});

export const pretendard400 = localFont({
  src: [
    {
      path: "./fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  fallback: [
    "system-ui",
    "Noto Sans KR",
    "Noto Serif KR",
    "sans-serif",
    "Apple SD Gothic Neo",
    "Segoe UI",
    "Roboto",
  ],
});
