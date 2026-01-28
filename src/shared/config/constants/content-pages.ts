import { RecipeQueryParams } from "@/entities/recipe";

import { CATEGORY_BASE_URL } from "./recipe";

export type ContentPageSearchParams = Pick<
  RecipeQueryParams,
  | "q"
  | "dishType"
  | "tags"
  | "ingredientIds"
  | "minCost"
  | "maxCost"
  | "minCalories"
  | "maxCalories"
  | "minCarb"
  | "maxCarb"
  | "minProtein"
  | "maxProtein"
  | "minFat"
  | "maxFat"
  | "types"
>;

export type ContentPage = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  searchParams: ContentPageSearchParams;
};

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: "diet-healthy",
    title: "🚨 입터짐 방지",
    subtitle: "살 빠지는 게 죄면 무기징역",
    imageUrl: `${CATEGORY_BASE_URL}healthy.webp`,
    searchParams: { tags: ["HEALTHY"], maxCalories: 400, minProtein: 15 },
  },
  {
    id: "ai-creative",
    title: "🤖 AI가 만든 신박한 조합",
    subtitle: "사람은 절대 못 떠올린 레시피",
    imageUrl: `${CATEGORY_BASE_URL}quick.webp`,
    searchParams: { types: ["AI"] },
  },
  {
    id: "chef-secret",
    title: "🤫 셰프 유튜버 시크릿",
    subtitle: "구독자 100만 채널 시그니처",
    imageUrl: `${CATEGORY_BASE_URL}chef.webp`,
    searchParams: { tags: ["CHEF_RECIPE"], types: ["YOUTUBE"] },
  },
  {
    id: "solo-drink",
    title: "☔️ 비 오는 날 이자카야 왜 가요?",
    subtitle: "퇴근 후 10분컷 혼술 안주",
    imageUrl: `${CATEGORY_BASE_URL}drink.webp`,
    searchParams: { tags: ["SOLO", "DRINK", "QUICK"] },
  },
  
  {
    id: "budget-gourmet",
    title: "💰 5천원으로 오마카세 기분",
    subtitle: "가성비 끝판왕 레시피",
    imageUrl: `${CATEGORY_BASE_URL}solo.webp`,
    searchParams: { maxCost: 5000 },
  },
  {
    id: "late-night-guilty",
    title: "🌙 새벽 2시 배고프면 지는 거야",
    subtitle: "죄책감 없는 야식 레시피",
    imageUrl: `${CATEGORY_BASE_URL}late_night.webp`,
    searchParams: { tags: ["LATE_NIGHT"], maxCalories: 500 },
  },
  
  {
    id: "youtube-mukbang",
    title: "📺 먹방 유튜버가 숨긴",
    subtitle: "영상 속 그 음식 직접 만들기",
    imageUrl: `${CATEGORY_BASE_URL}late_night.webp`,
    searchParams: { tags: ["LATE_NIGHT"], types: ["YOUTUBE"] },
  },
  {
    id: "hangover-soup",
    title: "🍲 어젯밤 기억이 없다면",
    subtitle: "속풀이 국물 레시피 모음",
    imageUrl: `${CATEGORY_BASE_URL}hangover.webp`,
    searchParams: { tags: ["HANGOVER"], dishType: "SOUP_STEW" },
  },
  
  {
    id: "air-fryer-legend",
    title: "🔥 에어프라이어 레전드",
    subtitle: "유튜브 1억뷰 돌파 레시피",
    imageUrl: `${CATEGORY_BASE_URL}air_fryer.webp`,
    searchParams: { tags: ["AIR_FRYER"], types: ["YOUTUBE"] },
  },
  {
    id: "kids-snack",
    title: "🥺 엄마 이거 또 해줘!",
    subtitle: "아이들이 직접 고른 간식",
    imageUrl: `${CATEGORY_BASE_URL}kids.webp`,
    searchParams: { tags: ["KIDS"] },
  },
  {
    id: "home-party-flex",
    title: "🏠 손님 왔는데 요리 못한다고?",
    subtitle: "있어보이는 홈파티 메뉴",
    imageUrl: `${CATEGORY_BASE_URL}home_party.webp`,
    searchParams: { tags: ["HOME_PARTY"] },
  },
  {
    id: "protein-bulk",
    title: "💪 헬창들의 찐 식단 공개",
    subtitle: "단백질 30g 이상 벌크업",
    imageUrl: `${CATEGORY_BASE_URL}high_protein.webp`,
    searchParams: { minProtein: 30 },
  },
];

export const PRICE_RANGES = [
  {
    id: "under-5000",
    label: "5천원 이하",
    description: "가성비 최고",
    maxCost: 5000,
    imageUrl: `${CATEGORY_BASE_URL}solo.webp`,
  },
  {
    id: "under-10000",
    label: "1만원 이하",
    description: "합리적인 가격",
    maxCost: 10000,
    imageUrl: `${CATEGORY_BASE_URL}air_fryer.webp`,
  },
  {
    id: "under-20000",
    label: "2만원 이하",
    description: "든든한 한끼",
    maxCost: 20000,
    imageUrl: `${CATEGORY_BASE_URL}home_party.webp`,
  },
  {
    id: "premium",
    label: "프리미엄",
    description: "특별한 날",
    minCost: 20000,
    imageUrl: `${CATEGORY_BASE_URL}healthy.webp`,
  },
];
