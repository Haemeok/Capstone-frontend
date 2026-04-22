// src/features/landing/config/landingTags.ts

export type LandingTagChip = {
  code: string;
  name: string;
};

export type LandingTagGroup = {
  id: "occasion" | "situation" | "speed";
  emoji: string;
  label: string;
  chips: LandingTagChip[];
};

export const LANDING_TAG_GROUPS: LandingTagGroup[] = [
  {
    id: "occasion",
    emoji: "💝",
    label: "기념일·특별한 날",
    chips: [
      { code: "HOME_PARTY", name: "홈파티" },
      { code: "HOLIDAY", name: "기념일" },
      { code: "BRUNCH", name: "브런치" },
      { code: "PICNIC", name: "피크닉" },
    ],
  },
  {
    id: "situation",
    emoji: "🍽",
    label: "일상·상황별",
    chips: [
      { code: "SOLO", name: "혼밥" },
      { code: "LUNCHBOX", name: "도시락" },
      { code: "HEALTHY", name: "다이어트" },
      { code: "LATE_NIGHT", name: "야식" },
      { code: "DRINK", name: "술안주" },
      { code: "HANGOVER", name: "해장" },
      { code: "CAMPING", name: "캠핑" },
      { code: "KIDS", name: "아이 반찬" },
    ],
  },
  {
    id: "speed",
    emoji: "⏱",
    label: "빠르게 만드는",
    chips: [
      { code: "QUICK", name: "초스피드" },
      { code: "AIR_FRYER", name: "에어프라이어" },
    ],
  },
];

export const buildTagSearchUrl = (code: string): string =>
  `/search/results?tags=${encodeURIComponent(code)}`;
