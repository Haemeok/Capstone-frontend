import type { Locale } from "./types";

const ACTIVITY_NAME_OVERLAY: Record<string, { ja: string; en: string }> = {
  "가볍게 달리기": { ja: "軽いジョギング", en: "light jogging" },
  "보통 속도로 걷기": {
    ja: "普通の速さのウォーキング",
    en: "moderate walking",
  },
  "자전거 타기": { ja: "サイクリング", en: "cycling" },
  줄넘기: { ja: "縄跳び", en: "jump rope" },
  "집안일, 청소하기": { ja: "家事・掃除", en: "housework & cleaning" },
  "반려견과 산책하기": { ja: "愛犬とのお散歩", en: "walking the dog" },
  "계단 오르기": { ja: "階段の上り", en: "climbing stairs" },
  "장 보러 다녀오기": { ja: "買い物", en: "grocery shopping" },
  "홈트, 스트레칭": {
    ja: "宅トレ・ストレッチ",
    en: "home workout & stretching",
  },
};

export const localizeActivityName = (name: string, locale: Locale): string => {
  if (locale === "ko") return name;
  return ACTIVITY_NAME_OVERLAY[name]?.[locale] ?? name;
};
