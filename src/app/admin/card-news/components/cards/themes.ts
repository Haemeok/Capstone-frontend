export type CardTheme = "classic" | "bold" | "frame" | "split" | "dark";

export const THEME_META: Record<CardTheme, { name: string; desc: string }> = {
  classic: { name: "Classic", desc: "깔끔한 기본" },
  bold: { name: "Bold", desc: "하이라이트 강조" },
  frame: { name: "Frame", desc: "감성 프레임" },
  split: { name: "Split", desc: "상하 분할" },
  dark: { name: "Dark", desc: "프리미엄 다크" },
};

export const THEME_LIST = Object.entries(THEME_META).map(([key, val]) => ({
  key: key as CardTheme,
  ...val,
}));
