export const IMAGE_BASE_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/";

export const CATEGORY_BASE_URL = `${IMAGE_BASE_URL}categories/`;
export const UI_BASE_URL = `${IMAGE_BASE_URL}ui/`;
export const SAVINGS_BASE_URL = `${IMAGE_BASE_URL}savings/`;
export const INGREDIENT_BASE_URL = `${IMAGE_BASE_URL}ingredients/`;
export const INGREDIENT_BLACK_BASE_URL = `${IMAGE_BASE_URL}ingredients-black/`;
export const ICON_BASE_URL = `${IMAGE_BASE_URL}icons/`;
export const LANDING_BASE_URL = `${IMAGE_BASE_URL}landing/`;
export const GUIDE_BASE_URL = `${IMAGE_BASE_URL}guide/`;
export const INGREDIENT_IMAGE_URL = (name: string) =>
  `${INGREDIENT_BASE_URL}${name}.webp`;
export const INGREDIENT_BLACK_IMAGE_URL = (name: string) =>
  `${INGREDIENT_BLACK_BASE_URL}${name}.webp`;

export const INGREDIENT_CATEGORIES_BASE = [
  "고기",
  "채소",
  "조미료/양념",
  "해산물",
  "가공/유제품",
  "곡물",
  "과일",
  "콩/견과류",
  "음료/주류",
  "빵/떡",
  "면",
  "기타",
] as const;

export const INGREDIENT_CATEGORIES = ["전체", ...INGREDIENT_CATEGORIES_BASE];

export const INGREDIENT_CATEGORIES_NEW_RECIPE = [
  "나의 재료",
  "전체",
  ...INGREDIENT_CATEGORIES_BASE,
];

export const INGREDIENT_CATEGORY_CODES: Record<string, string> = {
  전체: "",
  고기: "meat",
  채소: "vegetable",
  "조미료/양념": "seasoning",
  해산물: "seafood",
  곡물: "grain",
  과일: "fruit",
  "콩/견과류": "legume_nut",
  "음료/주류": "beverage",
  "가공/유제품": "dairy",
  "빵/떡": "bread",
  면: "noodle",
  기타: "other",
};

export const DISH_TYPES = [
  "전체",
  "볶음",
  "국/찌개/탕",
  "구이",
  "무침/샐러드",
  "튀김/부침",
  "찜/조림",
  "오븐요리",
  "생식/회",
  "절임/피클류",
  "밥/면/파스타",
  "디저트/간식류",
];

export const DISH_TYPE_ICONS: Record<string, string> = {
  "전체": "all.webp",
  "볶음": "frying.webp",
  "국/찌개/탕": "soup_stew.webp",
  "구이": "grill.webp",
  "무침/샐러드": "salad.webp",
  "튀김/부침": "fried_pan.webp",
  "찜/조림": "steamed_braised.webp",
  "오븐요리": "oven.webp",
  "생식/회": "raw.webp",
  "절임/피클류": "pickle.webp",
  "밥/면/파스타": "rice_noodle.webp",
  "디저트/간식류": "dessert.webp",
} as const;

export const DISH_TYPES_FOR_CREATE_RECIPE = DISH_TYPES.slice(1);

export const DISH_TYPE_CODES = {
  전체: null,
  볶음: "FRYING",
  "국/찌개/탕": "SOUP_STEW",
  구이: "GRILL",
  "무침/샐러드": "SALAD",
  "튀김/부침": "FRIED_PAN",
  "찜/조림": "STEAMED_BRAISED",
  오븐요리: "OVEN",
  "생식/회": "RAW",
  "절임/피클류": "PICKLE",
  "밥/면/파스타": "RICE_NOODLE",
  "디저트/간식류": "DESSERT",
};

export const DISH_TYPE_CODES_TO_NAME = Object.fromEntries(
  Object.entries(DISH_TYPE_CODES).map(([key, value]) => [value, key])
);

export const TAG_DEFINITIONS = [
  { name: "셰프 레시피", emoji: "👨‍🍳", code: "CHEF_RECIPE" },
  { name: "홈파티", emoji: "🏠", code: "HOME_PARTY" },
  { name: "브런치", emoji: "🥐", code: "BRUNCH" },
  { name: "초스피드 / 간단 요리", emoji: "⚡", code: "QUICK" },
  { name: "야식", emoji: "🌙", code: "LATE_NIGHT" },
  { name: "도시락", emoji: "🍱", code: "LUNCHBOX" },
  { name: "피크닉", emoji: "🌼", code: "PICNIC" },
  { name: "캠핑", emoji: "🏕️", code: "CAMPING" },
  { name: "다이어트 / 건강식", emoji: "🥗", code: "HEALTHY" },
  { name: "아이와 함께", emoji: "👶", code: "KIDS" },
  { name: "혼밥", emoji: "🍽️", code: "SOLO" },
  { name: "기념일 / 명절", emoji: "🎉", code: "HOLIDAY" },
  { name: "술안주", emoji: "🍶", code: "DRINK" },
  { name: "에어프라이어", emoji: "🔌", code: "AIR_FRYER" },
  { name: "해장", emoji: "🍲", code: "HANGOVER" },
] as const;

export const TAG_CODES = Object.fromEntries(
  TAG_DEFINITIONS.map((tag) => [tag.name, tag.code])
);

export const TAGS_BY_CODE = TAG_DEFINITIONS.reduce(
  (acc, tag) => {
    acc[tag.code] = tag;
    return acc;
  },
  {} as Record<
    (typeof TAG_DEFINITIONS)[number]["code"],
    (typeof TAG_DEFINITIONS)[number]
  >
);

export const TAGS_BY_NAME = TAG_DEFINITIONS.reduce(
  (acc, tag) => {
    acc[tag.name] = tag;
    return acc;
  },
  {} as Record<
    (typeof TAG_DEFINITIONS)[number]["name"],
    (typeof TAG_DEFINITIONS)[number]
  >
);

type ValueOf<T> = T[keyof T];

export type TagCode = ValueOf<typeof TAG_CODES>;

export const SORT_TYPES = ["최신순", "오래된순"];

export const SORT_TYPE_CODES = {
  최신순: "createdAt,DESC",
  오래된순: "createdAt,ASC",
};

export const SORT_CONFIGS = {
  comment: {
    최신순: { field: "createdAt", direction: "DESC" },
    좋아요순: { field: "likeCount", direction: "DESC" },
  },
  recipe: {
    최신순: { field: "createdAt", direction: "DESC" },
    좋아요순: { field: "likeCount", direction: "DESC" },
    별점순: { field: "avgRating", direction: "DESC" },
  },
  myFridge: {
    최신순: { field: "createdAt", direction: "DESC" },
    좋아요순: { field: "favoriteCount", direction: "DESC" },
    별점순: { field: "avgRating", direction: "DESC" },
  },
} as const;

export type CommentSortType = keyof typeof SORT_CONFIGS.comment;
export type RecipeSortType = keyof typeof SORT_CONFIGS.recipe;
export type MyFridgeSortType = keyof typeof SORT_CONFIGS.myFridge;

export type SortConfig = {
  field: string;
  direction: string;
};

export const DRAWER_HEADERS = {
  dishType: "요리 유형 선택",
  sort: "정렬 방식 선택",
  tags: "태그 선택",
  nutrition: "영양성분 및 가격",
};

export const DRAWER_DESCRIPTIONS = {
  dishType: "원하는 요리 유형을 선택하세요.",
  tags: "원하는 태그를 모두 선택하세요.",
  nutrition: "원하는 범위를 설정하세요.",
};

export type DrawerType = "dishType" | "sort" | "tags" | "nutrition";
export type BaseDrawerType = Exclude<DrawerType, "nutrition">;

export type BaseDrawerConfig = {
  header: string;
  description?: string;
  isMultiple: boolean;
  availableValues: string[];
};

export const BASE_DRAWER_CONFIGS: Record<BaseDrawerType, BaseDrawerConfig> = {
  dishType: {
    header: DRAWER_HEADERS.dishType,
    description: DRAWER_DESCRIPTIONS.dishType,
    isMultiple: false,
    availableValues: DISH_TYPES,
  },
  sort: {
    header: DRAWER_HEADERS.sort,
    isMultiple: false,
    availableValues: SORT_TYPES,
  },
  tags: {
    header: DRAWER_HEADERS.tags,
    description: DRAWER_DESCRIPTIONS.tags,
    isMultiple: true,
    availableValues: TAG_DEFINITIONS.map((tag) => `${tag.emoji} ${tag.name}`),
  },
};

export const FOUR_CUT_IMAGE =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/4cut/4cut.png";

export const TAGS_IMAGE_KEYS: Record<TagCode, string> = {
  AIR_FRYER: "air_fryer.webp",
  BRUNCH: "brunch.webp",
  CAMPING: "camping.webp",
  DRINK: "drink.webp",
  HANGOVER: "hangover.webp",
  HEALTHY: "healthy.webp",
  HOLIDAY: "holiday.webp",
  HOME_PARTY: "home_party.webp",
  KIDS: "kids.webp",
  LATE_NIGHT: "late_night.webp",
  LUNCHBOX: "lunchbox.webp",
  PICNIC: "picnic.webp",
  QUICK: "quick.webp",
  SOLO: "solo.webp",
  CHEF_RECIPE: "chef.webp",
};

export const PRICE_BRACKETS = [
  {
    min: 1000000,
    name: "냉장고",
    image: `${SAVINGS_BASE_URL}refrigerator.webp`,
    code: "REFRIGERATOR",
  },
  {
    min: 600000,
    name: "서울 원룸 월세 (1개월 기준)",
    image: `${SAVINGS_BASE_URL}monthly_rent.webp`,
    code: "MONTHLY_RENT",
  },
  {
    min: 500000,
    name: "시그니엘 1박 2일 2인 호캉스",
    image: `${SAVINGS_BASE_URL}signiel.webp`,
    code: "SIGNIEL",
  },
  {
    min: 450000,
    name: "미닉스 음식물 처리기",
    image: `${SAVINGS_BASE_URL}food_processor.webp`,
    code: "FOOD_PROCESSOR",
  },
  {
    min: 400000,
    name: "미슐랭 3스타 디너",
    image: `${SAVINGS_BASE_URL}mosu_dinner.webp`,
    code: "MOSU_DINNER",
  },
  {
    min: 350000,
    name: "PT 6회권",
    image: `${SAVINGS_BASE_URL}pt.webp`,
    code: "PT",
  },
  {
    min: 300000,
    name: "닌자 믹서기 (TB301KR)",
    image: `${SAVINGS_BASE_URL}blender.webp`,
    code: "BLENDER",
  },
  {
    min: 250000,
    name: "비행기 후쿠오카",
    image: `${SAVINGS_BASE_URL}fukuoka.webp`,
    code: "FUKUOKA",
  },
  {
    min: 200000,
    name: "에어팟",
    image: `${SAVINGS_BASE_URL}airpods.webp`,
    code: "AIRPODS",
  },
  {
    min: 150000,
    name: "글로벌 나이프 세트 G-465",
    image: `${SAVINGS_BASE_URL}knife_set.webp`,
    code: "KNIFE_SET",
  },
  {
    min: 100000,
    name: "뮤지컬 티켓",
    image: `${SAVINGS_BASE_URL}musical_ticket.webp`,
    code: "MUSICAL_TICKET",
  },
  {
    min: 80000,
    name: "오마카세",
    image: `${SAVINGS_BASE_URL}omakase.webp`,
    code: "OMAKASE",
  },
  {
    min: 60000,
    name: "에어프라이어",
    image: `${SAVINGS_BASE_URL}air_fryer.webp`,
    code: "AIR_FRYER",
  },
  {
    min: 40000,
    name: "강아지 사료 (프리미엄 급)",
    image: `${SAVINGS_BASE_URL}dog_food.webp`,
    code: "DOG_FOOD",
  },
  {
    min: 25000,
    name: "제주도 비행기 (단거리 특가)",
    image: `${SAVINGS_BASE_URL}jeju.webp`,
    code: "JEJU",
  },
  {
    min: 20000,
    name: "BBQ 황금올리브",
    image: `${SAVINGS_BASE_URL}bbq.webp`,
    code: "BBQ",
  },
  {
    min: 10000,
    name: "유튜브 프리미엄",
    image: `${SAVINGS_BASE_URL}youtube_premium.webp`,
    code: "YOUTUBE_PREMIUM",
  },
  {
    min: 5000,
    name: "스포티파이 구독",
    image: `${SAVINGS_BASE_URL}spotify.webp`,
    code: "SPOTIFY",
  },
  {
    min: 1,
    name: "커피",
    image: `${SAVINGS_BASE_URL}coffee.webp`,
    code: "COFFEE",
  },
  {
    min: 0,
    name: "0",
    image: `${SAVINGS_BASE_URL}zero.webp`,
    code: "ZERO",
  },
];

export const TAG_ITEMS = TAG_DEFINITIONS.map((tag, index) => ({
  id: index,
  name: tag.name,
  code: tag.code,
  imageUrl: `${CATEGORY_BASE_URL}${
    TAGS_IMAGE_KEYS[tag.code as keyof typeof TAGS_IMAGE_KEYS]
  }`,
}));

export const COOKING_TIME_ITEMS = {
  "10분이내": 10,
  "20분이내": 20,
  "30분이내": 30,
  "1시간이내": 60,
  "2시간이내": 120,
};

export const COOKING_TIME_ITEMS_KEYS = Object.fromEntries(
  Object.entries(COOKING_TIME_ITEMS).map(([key, value]) => [value, key])
);

export const COOKING_TIMES = Object.keys(COOKING_TIME_ITEMS);

export const DEFAULT_WEIGHT_KG = 65;

export const ONBOARDING_RECIPE_ID = 261;

export const COOKING_COMPLETION_MESSAGE_DURATION_MS = 2000;

export const CALORIE_ACTIVITIES = [
  { name: "가볍게 달리기", met: 8.0 },
  { name: "보통 속도로 걷기", met: 3.5 },
  { name: "자전거 타기", met: 6.8 },
  { name: "줄넘기", met: 10.0 },

  { name: "집안일, 청소하기", met: 3.3 },
  { name: "반려견과 산책하기", met: 3.0 },
  { name: "계단 오르기", met: 4.0 },
  { name: "장 보러 다녀오기", met: 2.3 },
  { name: "홈트, 스트레칭", met: 2.5 },
];

export type Activity = (typeof CALORIE_ACTIVITIES)[number];

export const NUTRITION_RANGES = {
  cost: { min: 0, max: 50000, step: 1000, unit: "원", label: "재료비" },
  calories: { min: 0, max: 3000, step: 50, unit: "kcal", label: "칼로리" },
  carb: { min: 0, max: 300, step: 10, unit: "g", label: "탄수화물" },
  protein: { min: 0, max: 200, step: 5, unit: "g", label: "단백질" },
  fat: { min: 0, max: 100, step: 5, unit: "g", label: "지방" },
  sugar: { min: 0, max: 100, step: 5, unit: "g", label: "당류" },
  sodium: { min: 0, max: 5000, step: 100, unit: "mg", label: "나트륨" },
} as const;

export type NutritionFilterKey = keyof typeof NUTRITION_RANGES;

export const NUTRITION_THEMES = {
  KETO: {
    label: "키토",
    icon: "keto.webp",
    description: "저탄수 고지방, 케토시스 유도",
    values: {
      carb: [0, 20] as [number, number],
      protein: [15, 50] as [number, number],
      fat: [30, 80] as [number, number],
    },
  },
  LOW_SUGAR: {
    label: "저당",
    icon: "low_sugar.webp",
    description: "당류 최소화, 혈당 관리",
    values: {
      sugar: [0, 10] as [number, number],
      carb: [0, 80] as [number, number],
    },
  },
  HIGH_PROTEIN: {
    label: "고단백",
    icon: "high_protein.webp",
    description: "단백질 우선, 근손실 방지",
    values: {
      protein: [30, 80] as [number, number],
      calories: [300, 800] as [number, number],
    },
  },
  WEGOVY_FRIENDLY: {
    label: "위고비 친화",
    icon: "low_calorie.webp",
    description: "소화 부담 적은 고단백 식단",
    values: {
      protein: [20, 40] as [number, number],
      fat: [0, 20] as [number, number],
      calories: [200, 450] as [number, number],
    },
  },
  ANTI_AGING: {
    label: "항노화",
    icon: "balanced.webp",
    description: "항산화 영양소 풍부",
    values: {
      calories: [250, 600] as [number, number],
      sugar: [0, 15] as [number, number],
      sodium: [0, 800] as [number, number],
    },
  },
  LOW_CALORIE: {
    label: "저칼로리",
    icon: "low_calorie.webp",
    description: "칼로리 제한, 체중 감량",
    values: {
      calories: [0, 500] as [number, number],
      fat: [0, 15] as [number, number],
    },
  },
  LOW_FAT: {
    label: "저지방",
    icon: "low_fat.webp",
    description: "지방 섭취 최소화",
    values: {
      fat: [0, 20] as [number, number],
      calories: [0, 600] as [number, number],
    },
  },
  LOW_SODIUM: {
    label: "저염식",
    icon: "low_sodium.webp",
    description: "나트륨 섭취 제한",
    values: {
      sodium: [0, 800] as [number, number],
    },
  },
  BALANCED: {
    label: "균형식",
    icon: "balanced.webp",
    description: "영양소 균형 잡힌 식단",
    values: {
      carb: [80, 150] as [number, number],
      protein: [40, 100] as [number, number],
      fat: [20, 50] as [number, number],
      calories: [400, 800] as [number, number],
    },
  },
  BUDGET: {
    label: "저예산",
    icon: "low_cost.webp",
    description: "비용 절감",
    values: {
      cost: [0, 10000] as [number, number],
    },
  },
} as const;

export type NutritionThemeKey = keyof typeof NUTRITION_THEMES;
