export const INGREDIENT_CATEGORIES = [
  '전체',
  '가공/유제품',
  '빵/떡',
  '채소',
  '해산물',
  '과일',
  '음료/주류',
  '곡물',
  '콩/견과류',
  '조미료/양념',
  '고기',
  '기타',
  '면',
];

export const INGREDIENT_CATEGORIES_NEW_RECIPE = [
  '나의 재료',
  '전체',
  '가공/유제품',
  '빵/떡',
  '채소',
  '해산물',
  '과일',
  '음료/주류',
  '곡물',
  '콩/견과류',
  '조미료/양념',
  '고기',
  '기타',
  '면',
];

export const INGREDIENT_CATEGORY_CODES = {
  전체: '',
  '가공/유제품': 'dairy',
  '빵/떡': 'bread',
  채소: 'vegetable',
  해산물: 'seafood',
  과일: 'fruit',
  '음료/주류': 'beverage',
  곡물: 'grain',
  '콩/견과류': 'legume_nut',
  '조미료/양념': 'seasoning',
  고기: 'meat',
  기타: 'other',
  면: 'noodle',
};

export const DISH_TYPES = [
  '전체',
  '볶음',
  '국/찌개/탕',
  '구이',
  '무침/샐러드',
  '튀김/부침',
  '찜/조림',
  '오븐요리',
  '생식/회',
  '절임/피클류',
  '밥/면/파스타',
  '디저트/간식류',
];

export const DISH_TYPES_FOR_CREATE_RECIPE = DISH_TYPES.slice(1);

export const DISH_TYPE_CODES = {
  전체: null,
  볶음: 'FRYING',
  '국/찌개/탕': 'SOUP_STEW',
  구이: 'GRILL',
  '무침/샐러드': 'SALAD',
  '튀김/부침': 'FRIED_PAN',
  '찜/조림': 'STEAMED_BRAISED',
  오븐요리: 'OVEN',
  '생식/회': 'RAW',
  '절임/피클류': 'PICKLE',
  '밥/면/파스타': 'RICE_NOODLE',
  '디저트/간식류': 'DESSERT',
};

export const TAGS = [
  '홈파티',
  '피크닉',
  '캠핑',
  '다이어트 / 건강식',
  '아이와 함께',
  '혼밥',
  '술안주',
  '브런치',
  '야식',
  '초스피드 / 간단 요리',
  '기념일 / 명절',
  '도시락',
  '에어프라이어',
  '해장',
];

export const TAG_EMOJI = {
  홈파티: '🏠',
  피크닉: '🌼',
  캠핑: '🏕️',
  '다이어트 / 건강식': '🥗',
  '아이와 함께': '👶',
  혼밥: '🍽️',
  술안주: '🍶',
  브런치: '🥐',
  야식: '🌙',
  '초스피드 / 간단 요리': '⚡',
  '기념일 / 명절': '🎉',
  도시락: '🍱',
  에어프라이어: '🔌',
  해장: '🍲',
};

export const TAG_CODES = {
  홈파티: 'HOME_PARTY',
  피크닉: 'PICNIC',
  캠핑: 'CAMPING',
  '다이어트 / 건강식': 'HEALTHY',
  '아이와 함께': 'KIDS',
  혼밥: 'SOLO',
  술안주: 'DRINK',
  브런치: 'BRUNCH',
  야식: 'LATE_NIGHT',
  '초스피드 / 간단 요리': 'QUICK',
  '기념일 / 명절': 'HOLIDAY',
  도시락: 'LUNCHBOX',
  에어프라이어: 'AIR_FRYER',
  해장: 'HANGOVER',
};

export const TAG_CODES_TO_NAME = {
  HOME_PARTY: '홈파티',
  PICNIC: '피크닉',
  CAMPING: '캠핑',
  HEALTHY: '다이어트 / 건강식',
  KIDS: '아이와 함께',
  SOLO: '혼밥',
  DRINK: '술안주',
  BRUNCH: '브런치',
  LATE_NIGHT: '야식',
  QUICK: '초스피드 / 간단 요리',
  HOLIDAY: '기념일 / 명절',
  LUNCHBOX: '도시락',
  AIR_FRYER: '에어프라이어',
  HANGOVER: '해장',
};

type ValueOf<T> = T[keyof T];

export type TagCode = ValueOf<typeof TAG_CODES>;

export const TAG_ITEMS = TAGS.map((tag, index) => ({
  id: index,
  name: tag,
  code: TAG_CODES[tag as keyof typeof TAG_CODES],
  imageUrl: `/${TAG_CODES[tag as keyof typeof TAG_CODES]}.png`,
}));

export const SORT_TYPES = ['최신순', '오래된순'];

export const SORT_TYPE_CODES = {
  최신순: 'DESC',
  오래된순: 'ASC',
};

export const DRAWER_HEADERS = {
  dishType: '요리 유형 선택',
  sort: '정렬 방식 선택',
  tags: '태그 선택',
};

export const DRAWER_DESCRIPTIONS = {
  dishType: '원하는 요리 유형을 선택하세요.',
  tags: '원하는 태그를 모두 선택하세요.',
};

export type DrawerType = 'dishType' | 'sort' | 'tags';

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
      (tag) => `${TAG_EMOJI[tag as keyof typeof TAG_EMOJI]} ${tag}`,
    ),
  },
};

export type FinalDrawerConfig = BaseDrawerConfig & {
  type: DrawerType;
  initialValue: string | string[];
  setValue: (value: string | string[]) => void;
};

export const FOUR_CUT_IMAGE =
  'https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/4cut/4cut.png';
