export const IMAGE_BASE_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/";

export const CATEGORY_BASE_URL = `${IMAGE_BASE_URL}categories/`;
export const UI_BASE_URL = `${IMAGE_BASE_URL}ui/`;
export const SAVINGS_BASE_URL = `${IMAGE_BASE_URL}savings/`;

export const INGREDIENT_CATEGORIES = [
  "전체",
  "가공/유제품",
  "빵/떡",
  "채소",
  "해산물",
  "과일",
  "음료/주류",
  "곡물",
  "콩/견과류",
  "조미료/양념",
  "고기",
  "기타",
  "면",
];

export const INGREDIENT_CATEGORIES_NEW_RECIPE = [
  "나의 재료",
  "전체",
  "가공/유제품",
  "빵/떡",
  "채소",
  "해산물",
  "과일",
  "음료/주류",
  "곡물",
  "콩/견과류",
  "조미료/양념",
  "고기",
  "기타",
  "면",
];

export const INGREDIENT_CATEGORY_CODES = {
  전체: "",
  "가공/유제품": "dairy",
  "빵/떡": "bread",
  채소: "vegetable",
  해산물: "seafood",
  과일: "fruit",
  "음료/주류": "beverage",
  곡물: "grain",
  "콩/견과류": "legume_nut",
  "조미료/양념": "seasoning",
  고기: "meat",
  기타: "other",
  면: "noodle",
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

export const TAGS = [
  "홈파티",
  "피크닉",
  "캠핑",
  "다이어트 / 건강식",
  "아이와 함께",
  "혼밥",
  "술안주",
  "브런치",
  "야식",
  "초스피드 / 간단 요리",
  "기념일 / 명절",
  "도시락",
  "에어프라이어",
  "해장",
];

export const TAG_EMOJI = {
  홈파티: "🏠",
  피크닉: "🌼",
  캠핑: "🏕️",
  "다이어트 / 건강식": "🥗",
  "아이와 함께": "👶",
  혼밥: "🍽️",
  술안주: "🍶",
  브런치: "🥐",
  야식: "🌙",
  "초스피드 / 간단 요리": "⚡",
  "기념일 / 명절": "🎉",
  도시락: "🍱",
  에어프라이어: "🔌",
  해장: "🍲",
};

export const TAG_CODES = {
  홈파티: "HOME_PARTY",
  피크닉: "PICNIC",
  캠핑: "CAMPING",
  "다이어트 / 건강식": "HEALTHY",
  "아이와 함께": "KIDS",
  혼밥: "SOLO",
  술안주: "DRINK",
  브런치: "BRUNCH",
  야식: "LATE_NIGHT",
  "초스피드 / 간단 요리": "QUICK",
  "기념일 / 명절": "HOLIDAY",
  도시락: "LUNCHBOX",
  에어프라이어: "AIR_FRYER",
  해장: "HANGOVER",
};

export const TAG_CODES_TO_NAME = {
  HOME_PARTY: "홈파티",
  PICNIC: "피크닉",
  CAMPING: "캠핑",
  HEALTHY: "다이어트 / 건강식",
  KIDS: "아이와 함께",
  SOLO: "혼밥",
  DRINK: "술안주",
  BRUNCH: "브런치",
  LATE_NIGHT: "야식",
  QUICK: "초스피드 / 간단 요리",
  HOLIDAY: "기념일 / 명절",
  LUNCHBOX: "도시락",
  AIR_FRYER: "에어프라이어",
  HANGOVER: "해장",
};

type ValueOf<T> = T[keyof T];

export type TagCode = ValueOf<typeof TAG_CODES>;

export const SORT_TYPES = ["최신순", "오래된순"];

export const SORT_TYPE_CODES = {
  최신순: "DESC",
  오래된순: "ASC",
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
} as const;

export type CommentSortType = keyof typeof SORT_CONFIGS.comment;
export type RecipeSortType = keyof typeof SORT_CONFIGS.recipe;

export type SortConfig = {
  field: string;
  direction: string;
};

export const DRAWER_HEADERS = {
  dishType: "요리 유형 선택",
  sort: "정렬 방식 선택",
  tags: "태그 선택",
};

export const DRAWER_DESCRIPTIONS = {
  dishType: "원하는 요리 유형을 선택하세요.",
  tags: "원하는 태그를 모두 선택하세요.",
};

export type DrawerType = "dishType" | "sort" | "tags";

export type BaseDrawerConfig = {
  header: string;
  description?: string;
  isMultiple: boolean;
  availableValues: string[];
};

export const BASE_DRAWER_CONFIGS: Record<DrawerType, BaseDrawerConfig> = {
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
    availableValues: TAGS.map(
      (tag) => `${TAG_EMOJI[tag as keyof typeof TAG_EMOJI]} ${tag}`
    ),
  },
};

export type FinalDrawerConfig = BaseDrawerConfig & {
  type: DrawerType;
  initialValue: string | string[];
  setValue: (value: string | string[]) => void;
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
};

export const PRICE_BRACKETS = [
  {
    min: 1000000,
    name: "냉장고",
    image: `${SAVINGS_BASE_URL}refrigerator.webp`,
    code: "REFRIGERATOR",
  },
  {
    min: 777777,
    name: "LUCKY",
    image: `${SAVINGS_BASE_URL}lucky.webp`,
    code: "LUCKY",
  },
  {
    min: 600000,
    name: "서울 원룸 월세",
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
    min: 400000,
    name: "노스페이스 패딩",
    image: `${SAVINGS_BASE_URL}northface_jacket.webp`,
    code: "NORTHFACE_JACKET",
  },
  {
    min: 350000,
    name: "PT 6회권",
    image: `${SAVINGS_BASE_URL}pt.webp`,
    code: "PT",
  },
  {
    min: 300000,
    name: "에어 조던",
    image: `${SAVINGS_BASE_URL}air_jordan.webp`,
    code: "AIR_JORDAN",
  },
  {
    min: 200000,
    name: "에어팟 (무선 이어폰)",
    image: `${SAVINGS_BASE_URL}airpods.webp`,
    code: "AIRPODS",
  },
  {
    min: 100000,
    name: "제주도, 후쿠오카 비행기 왕복",
    image: `${SAVINGS_BASE_URL}jeju.webp`,
    code: "JEJU",
  },
  {
    min: 50000,
    name: "경기권 오마카세 디너 평균",
    image: `${SAVINGS_BASE_URL}omakase.webp`,
    code: "OMAKASE",
  },
  {
    min: 20000,
    name: "BBQ 황금올리브 닭다리",
    image: `${SAVINGS_BASE_URL}bbq.webp`,
    code: "BBQ",
  },
  {
    min: 10000,
    name: "메가박스 영화 관람권+팝콘세트",
    image: `${SAVINGS_BASE_URL}movie_ticket.webp`,
    code: "MOVIE_TICKET",
  },
  {
    min: 0,
    name: "커피 한 잔",
    image: `${SAVINGS_BASE_URL}coffee.webp`,
    code: "COFFEE",
  },
];

export const TAG_ITEMS = TAGS.map((tag, index) => ({
  id: index,
  name: tag,
  code: TAG_CODES[tag as keyof typeof TAG_CODES],
  imageUrl: `${CATEGORY_BASE_URL}${
    TAGS_IMAGE_KEYS[TAG_CODES[tag as keyof typeof TAG_CODES]]
  }`,
}));

export const cookingTimeItems = [
  { label: "10분이내", value: 10 },
  { label: "20분이내", value: 20 },
  { label: "30분이내", value: 30 },
  { label: "1시간이내", value: 60 },
  { label: "2시간이내", value: 120 },
];

export const cookingTimes = [
  "10분이내",
  "20분이내",
  "30분이내",
  "1시간이내",
  "2시간이내",
];
