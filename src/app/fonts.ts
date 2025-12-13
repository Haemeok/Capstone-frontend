import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "./fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "./fonts/Pretendard-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-pretendard",
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
