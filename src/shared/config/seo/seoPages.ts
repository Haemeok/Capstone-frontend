// ============================================================
// SEO 페이지 생성기 — 구조화된 쿼리 파라미터 기반 (~20K+ 페이지)
// ============================================================

import { MAIN_INGREDIENTS } from "./ingredients";
import { generateSearchKeywords } from "./searchKeywords";

// ── 상수 ──

const DISH_TYPE_ENTRIES: Array<{ code: string; name: string }> = [
  { code: "FRYING", name: "볶음" },
  { code: "SOUP_STEW", name: "국/찌개/탕" },
  { code: "GRILL", name: "구이" },
  { code: "SALAD", name: "무침/샐러드" },
  { code: "FRIED_PAN", name: "튀김/부침" },
  { code: "STEAMED_BRAISED", name: "찜/조림" },
  { code: "OVEN", name: "오븐요리" },
  { code: "RAW", name: "생식/회" },
  { code: "PICKLE", name: "절임/피클류" },
  { code: "RICE_NOODLE", name: "밥/면/파스타" },
  { code: "DESSERT", name: "디저트/간식류" },
];

const TAG_ENTRIES: Array<{ code: string; name: string }> = [
  { code: "CHEF_RECIPE", name: "셰프 레시피" },
  { code: "HOME_PARTY", name: "홈파티" },
  { code: "BRUNCH", name: "브런치" },
  { code: "QUICK", name: "초스피드" },
  { code: "LATE_NIGHT", name: "야식" },
  { code: "LUNCHBOX", name: "도시락" },
  { code: "PICNIC", name: "피크닉" },
  { code: "CAMPING", name: "캠핑" },
  { code: "HEALTHY", name: "다이어트" },
  { code: "KIDS", name: "아이" },
  { code: "SOLO", name: "혼밥" },
  { code: "HOLIDAY", name: "기념일" },
  { code: "DRINK", name: "술안주" },
  { code: "AIR_FRYER", name: "에어프라이어" },
  { code: "HANGOVER", name: "해장" },
];

const COST_BRACKETS = [
  { value: 3000, label: "3천원" },
  { value: 5000, label: "5천원" },
  { value: 10000, label: "만원" },
  { value: 15000, label: "1만5천원" },
];

type NutritionThemeConfig = {
  key: string;
  label: string;
  seoLabel: string;
  params: Record<string, number>;
};

const NUTRITION_THEMES_FOR_SEO: NutritionThemeConfig[] = [
  // ── 식단러 특화 (params 많은 것 먼저 → buildEnhancedQuery 매칭 우선) ──
  { key: "DIET_MEAL", label: "다이어트식단", seoLabel: "다이어트 식단용 저칼로리 고단백",
    params: { minProtein: 25, maxCalories: 500, maxFat: 15 } },
  { key: "BALANCED", label: "균형식", seoLabel: "영양 균형 잡힌",
    params: { minCarb: 80, maxCarb: 150, minProtein: 40, maxProtein: 100 } },
  { key: "HIGH_PROTEIN_LOW_FAT", label: "고단백저지방", seoLabel: "고단백 저지방",
    params: { minProtein: 30, maxFat: 15, maxCalories: 600 } },
  { key: "BULK_MEAL", label: "벌크업", seoLabel: "벌크업 고탄수 고단백",
    params: { minProtein: 40, minCarb: 80 } },

  // ── 단백질 3단계 (헬스인 세분화) ──
  { key: "HIGH_PROTEIN", label: "고단백", seoLabel: "단백질 30g 이상 고단백",
    params: { minProtein: 30, maxCalories: 800 } },
  { key: "HIGH_PROTEIN_40", label: "고단백40", seoLabel: "한끼 단백질 40g 채우는",
    params: { minProtein: 40 } },
  { key: "HIGH_PROTEIN_50", label: "고단백50", seoLabel: "단백질 50g 폭탄",
    params: { minProtein: 50 } },

  // ── 다이어트 핵심 ──
  { key: "LOW_CALORIE", label: "저칼로리", seoLabel: "500kcal 이하 저칼로리",
    params: { maxCalories: 500, maxFat: 15 } },
  { key: "ULTRA_LOW_CAL", label: "극저칼", seoLabel: "300kcal 이하 극저칼로리",
    params: { maxCalories: 300 } },

  // ── 탄수/당류 제한 ──
  { key: "KETO", label: "키토", seoLabel: "탄수화물 20g 이하 키토",
    params: { maxCarb: 20, minFat: 30 } },
  { key: "LOW_CARB", label: "저탄수", seoLabel: "저탄수화물",
    params: { maxCarb: 50 } },
  { key: "LOW_SUGAR", label: "저당", seoLabel: "당류 10g 이하 저당",
    params: { maxSugar: 10, maxCarb: 80 } },
  { key: "ZERO_SUGAR", label: "제로슈거", seoLabel: "당류 거의 제로",
    params: { maxSugar: 3, maxCarb: 30 } },

  // ── 기타 건강 ──
  { key: "LOW_SODIUM", label: "저염식", seoLabel: "나트륨 800mg 이하 저염",
    params: { maxSodium: 800 } },
  { key: "LOW_FAT", label: "저지방", seoLabel: "지방 20g 이하 저지방",
    params: { maxFat: 20, maxCalories: 600 } },
];

// ── 부자연스러운 조합 필터 ──

const INVALID_INGREDIENT_DISH = new Set([
  // 과일/유제품 + 국물요리
  "바나나:SOUP_STEW", "딸기:SOUP_STEW", "블루베리:SOUP_STEW", "망고:SOUP_STEW",
  "사과:SOUP_STEW", "포도:SOUP_STEW", "수박:SOUP_STEW", "복숭아:SOUP_STEW",
  "귤:SOUP_STEW", "키위:SOUP_STEW", "체리:SOUP_STEW", "파인애플:SOUP_STEW",
  "우유:SOUP_STEW", "요거트:SOUP_STEW", "아이스크림:SOUP_STEW",
  // 과일/유제품 + 구이
  "바나나:GRILL", "딸기:GRILL", "블루베리:GRILL", "우유:GRILL",
  "요거트:GRILL", "생크림:GRILL", "아이스크림:GRILL",
  "수박:GRILL", "포도:GRILL", "복숭아:GRILL", "귤:GRILL",
  // 양식재료 + 한식국물
  "아보카도:SOUP_STEW", "치즈:SOUP_STEW", "베이컨:SOUP_STEW",
  "아보카도:STEAMED_BRAISED", "파스타면:SOUP_STEW",
  // 해산물 + 부자연 조합
  "연어:STEAMED_BRAISED", "연어:PICKLE",
  "랍스터:FRYING", "랍스터:PICKLE",
  // 기타
  "초콜릿:SOUP_STEW", "초콜릿:GRILL", "초콜릿:FRYING", "초콜릿:STEAMED_BRAISED",
  "초콜릿:SALAD", "초콜릿:RAW", "초콜릿:PICKLE", "초콜릿:RICE_NOODLE",
  "빵:SOUP_STEW", "빵:STEAMED_BRAISED", "빵:PICKLE",
  "식빵:SOUP_STEW", "식빵:STEAMED_BRAISED", "식빵:PICKLE",
  "케이크:SOUP_STEW", "케이크:GRILL", "케이크:FRYING",
  // 생식 부적합
  "돼지고기:RAW", "닭고기:RAW", "닭가슴살:RAW", "닭다리:RAW", "닭날개:RAW",
  "소시지:RAW", "햄:RAW", "스팸:RAW", "베이컨:RAW",
  "돼지 앞다리살:RAW", "삼겹살:RAW", "목살:RAW", "항정살:RAW",
  // 디저트 부적합
  "삼겹살:DESSERT", "소고기:DESSERT", "돼지고기:DESSERT", "닭고기:DESSERT",
  "오징어:DESSERT", "낙지:DESSERT", "문어:DESSERT", "조개:DESSERT",
  "김치:DESSERT", "마늘:DESSERT", "양파:DESSERT", "대파:DESSERT",
  "고추:DESSERT", "무:DESSERT", "배추:DESSERT", "콩나물:DESSERT",
  "두부:DESSERT", "어묵:DESSERT", "스팸:DESSERT",
  // 절임 부적합
  "소고기:PICKLE", "돼지고기:PICKLE", "닭고기:PICKLE", "닭가슴살:PICKLE",
  "삼겹살:PICKLE", "새우:PICKLE", "오징어:PICKLE",
]);

const INVALID_INGREDIENT_TAG = new Set([
  // 고칼로리 + 건강식
  "삼겹살:HEALTHY", "스팸:HEALTHY", "베이컨:HEALTHY", "소시지:HEALTHY",
  "햄:HEALTHY", "라면:HEALTHY", "떡볶이떡:HEALTHY", "초콜릿:HEALTHY",
  "아이스크림:HEALTHY", "케이크:HEALTHY", "쿠키:HEALTHY", "과자:HEALTHY",
  "버터:HEALTHY", "마요네즈:HEALTHY", "치즈:HEALTHY",
  "우삼겹:HEALTHY", "차돌박이:HEALTHY", "항정살:HEALTHY",
  // 해산물 + 캠핑 (보관 어려움)
  "회:CAMPING", "생선회:CAMPING", "굴:CAMPING",
  // 디저트재료 + 해장
  "초콜릿:HANGOVER", "케이크:HANGOVER", "쿠키:HANGOVER", "아이스크림:HANGOVER",
  "바나나:HANGOVER", "딸기:HANGOVER",
  // 디저트재료 + 야식
  "바나나:LATE_NIGHT", "딸기:LATE_NIGHT", "블루베리:LATE_NIGHT",
  "키위:LATE_NIGHT", "체리:LATE_NIGHT",
  // 디저트재료 + 도시락
  "아이스크림:LUNCHBOX",
  // 아이와 함께 부적합
  "소주:KIDS", "맥주:KIDS", "와인:KIDS", "위스키:KIDS",
  // 술안주 부적합
  "바나나:DRINK", "딸기:DRINK", "사과:DRINK", "우유:DRINK",
  "요거트:DRINK", "아이스크림:DRINK", "시리얼:DRINK",
]);

const INVALID_INGREDIENT_NUTRITION = new Set([
  // 고지방 재료 + 저칼로리/저지방
  "삼겹살:LOW_CALORIE", "삼겹살:LOW_FAT", "삼겹살:KETO",
  "차돌박이:LOW_CALORIE", "차돌박이:LOW_FAT",
  "우삼겹:LOW_CALORIE", "우삼겹:LOW_FAT",
  "항정살:LOW_CALORIE", "항정살:LOW_FAT",
  "베이컨:LOW_CALORIE", "베이컨:LOW_FAT",
  "스팸:LOW_CALORIE", "스팸:LOW_FAT",
  "버터:LOW_CALORIE", "버터:LOW_FAT",
  "크림치즈:LOW_CALORIE", "크림치즈:LOW_FAT",
  // 탄수화물 재료 + 키토
  "밥:KETO", "즉석밥:KETO", "떡:KETO", "빵:KETO", "식빵:KETO",
  "파스타면:KETO", "라면:KETO", "국수:KETO", "우동:KETO",
  "감자:KETO", "고구마:KETO", "옥수수:KETO",
  // 단 재료 + 저당
  "초콜릿:LOW_SUGAR", "꿀:LOW_SUGAR", "사탕:LOW_SUGAR",
  "아이스크림:LOW_SUGAR", "케이크:LOW_SUGAR",
  // 고지방 재료 + 고단백저지방/다이어트식단
  "삼겹살:HIGH_PROTEIN_LOW_FAT", "베이컨:HIGH_PROTEIN_LOW_FAT",
  "우삼겹:HIGH_PROTEIN_LOW_FAT", "항정살:HIGH_PROTEIN_LOW_FAT",
  "버터:HIGH_PROTEIN_LOW_FAT", "크림치즈:HIGH_PROTEIN_LOW_FAT",
  "스팸:HIGH_PROTEIN_LOW_FAT",
  "삼겹살:DIET_MEAL", "베이컨:DIET_MEAL", "스팸:DIET_MEAL",
  "우삼겹:DIET_MEAL", "항정살:DIET_MEAL", "버터:DIET_MEAL",
  // 극저칼로리 부적합
  "삼겹살:ULTRA_LOW_CAL", "차돌박이:ULTRA_LOW_CAL", "우삼겹:ULTRA_LOW_CAL",
  "베이컨:ULTRA_LOW_CAL", "스팸:ULTRA_LOW_CAL", "버터:ULTRA_LOW_CAL",
  "항정살:ULTRA_LOW_CAL", "크림치즈:ULTRA_LOW_CAL",
  // 제로슈거 부적합
  "꿀:ZERO_SUGAR", "초콜릿:ZERO_SUGAR", "아이스크림:ZERO_SUGAR",
  "케이크:ZERO_SUGAR", "사탕:ZERO_SUGAR",
  // 저탄수 부적합
  "밥:LOW_CARB", "즉석밥:LOW_CARB", "떡:LOW_CARB", "빵:LOW_CARB",
  "식빵:LOW_CARB", "파스타면:LOW_CARB", "라면:LOW_CARB", "국수:LOW_CARB",
  "우동:LOW_CARB", "감자:LOW_CARB", "고구마:LOW_CARB", "옥수수:LOW_CARB",
]);

// 인기 tags (3차원 조합용)
const POPULAR_TAGS = ["SOLO", "QUICK", "HEALTHY"];

// 3차원 조합은 Tier 1 재료만 사용 (기존: TOP_INGREDIENT_COUNT = 100)

// ── 타입 ──

export type SeoPage = {
  params: Record<string, string | number>;
  title: string;
  description: string;
};

// ── 유틸 ──

// ── 생성 함수 ──

export const generateSeoPages = (): SeoPage[] => {
  const pages: SeoPage[] = [];
  const seen = new Set<string>();

  const addPage = (page: SeoPage) => {
    const key = JSON.stringify(
      Object.entries(page.params).sort(([a], [b]) => a.localeCompare(b))
    );
    if (!seen.has(key)) {
      seen.add(key);
      pages.push(page);
    }
  };

  // ── A. 기존 텍스트 키워드 (q 파라미터) ──
  for (const keyword of generateSearchKeywords()) {
    addPage({
      params: { q: keyword },
      title: keyword.includes("레시피") ? keyword : `${keyword} 레시피`,
      description: `${keyword} 레시피를 찾아보세요.`,
    });
  }

  const mainIngredients = MAIN_INGREDIENTS;

  // ── B. 재료 단독 (ingredientIds) ──
  for (const ing of mainIngredients) {
    addPage({
      params: { ingredientIds: ing.id },
      title: `${ing.name} 요리 레시피 모음`,
      description: `${ing.name}(으)로 만들 수 있는 다양한 요리 레시피를 확인하세요.`,
    });
  }

  // ── C. 재료 × dishType ──
  for (const ing of mainIngredients) {
    for (const dish of DISH_TYPE_ENTRIES) {
      if (INVALID_INGREDIENT_DISH.has(`${ing.name}:${dish.code}`)) continue;
      addPage({
        params: { ingredientIds: ing.id, dishType: dish.code },
        title: `${ing.name} ${dish.name} 레시피`,
        description: `${ing.name}(으)로 만드는 ${dish.name} 레시피 모음입니다.`,
      });
    }
  }

  // ── D. 재료 × tags ──
  for (const ing of mainIngredients) {
    for (const tag of TAG_ENTRIES) {
      if (INVALID_INGREDIENT_TAG.has(`${ing.name}:${tag.code}`)) continue;
      addPage({
        params: { ingredientIds: ing.id, tags: tag.code },
        title: `${tag.name} ${ing.name} 레시피`,
        description: `${tag.name}에 딱 맞는 ${ing.name} 요리 레시피입니다.`,
      });
    }
  }

  // ── E. 재료 × maxCost ──
  for (const ing of mainIngredients) {
    for (const cost of COST_BRACKETS) {
      addPage({
        params: { ingredientIds: ing.id, maxCost: cost.value },
        title: `${cost.label} 이하 ${ing.name} 요리`,
        description: `${cost.label} 이하로 만드는 ${ing.name} 요리 레시피입니다.`,
      });
    }
  }

  // ── F. dishType × tags ──
  for (const dish of DISH_TYPE_ENTRIES) {
    for (const tag of TAG_ENTRIES) {
      addPage({
        params: { dishType: dish.code, tags: tag.code },
        title: `${tag.name} ${dish.name} 레시피`,
        description: `${tag.name}에 어울리는 ${dish.name} 레시피 모음입니다.`,
      });
    }
  }

  // ── G. 예산 단독 + 예산×tags + 예산×dishType ──
  for (const cost of COST_BRACKETS) {
    addPage({
      params: { maxCost: cost.value },
      title: `${cost.label} 이하 레시피`,
      description: `${cost.label} 이하로 만들 수 있는 레시피 모음입니다.`,
    });

    for (const tag of TAG_ENTRIES) {
      addPage({
        params: { maxCost: cost.value, tags: tag.code },
        title: `${cost.label} 이하 ${tag.name} 레시피`,
        description: `${cost.label} 이하 ${tag.name} 레시피 모음입니다.`,
      });
    }

    for (const dish of DISH_TYPE_ENTRIES) {
      addPage({
        params: { maxCost: cost.value, dishType: dish.code },
        title: `${cost.label} 이하 ${dish.name} 레시피`,
        description: `${cost.label} 이하 ${dish.name} 레시피 모음입니다.`,
      });
    }
  }

  // ── H. 영양테마 단독 + 영양×tags + 영양×dishType ──
  for (const theme of NUTRITION_THEMES_FOR_SEO) {
    addPage({
      params: { ...theme.params },
      title: `${theme.seoLabel} 레시피`,
      description: `${theme.seoLabel} 레시피를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.`,
    });

    for (const tag of TAG_ENTRIES) {
      addPage({
        params: { ...theme.params, tags: tag.code },
        title: `${theme.seoLabel} ${tag.name} 레시피`,
        description: `${tag.name}에 맞는 ${theme.seoLabel} 레시피를 확인하세요.`,
      });
    }

    for (const dish of DISH_TYPE_ENTRIES) {
      addPage({
        params: { ...theme.params, dishType: dish.code },
        title: `${theme.seoLabel} ${dish.name} 레시피`,
        description: `${theme.seoLabel} ${dish.name} 레시피를 확인하세요.`,
      });
    }
  }

  // ── I. 재료 × 영양테마 ──
  for (const ing of mainIngredients) {
    for (const theme of NUTRITION_THEMES_FOR_SEO) {
      if (INVALID_INGREDIENT_NUTRITION.has(`${ing.name}:${theme.key}`)) continue;
      addPage({
        params: { ingredientIds: ing.id, ...theme.params },
        title: `${theme.seoLabel} ${ing.name} 레시피`,
        description: `${theme.seoLabel} ${ing.name} 요리 레시피를 확인하세요.`,
      });
    }
  }

  // ── J. 3차원 조합: 재료 × dishType × tags (상위 인기 재료만) ──
  // Tier 1 재료만 사용하여 조합 폭발 방지
  const tier1Ingredients = mainIngredients.filter((i) => i.tier === 1);
  for (const ing of tier1Ingredients.length > 0 ? tier1Ingredients : mainIngredients.slice(0, 100)) {
    for (const dish of DISH_TYPE_ENTRIES) {
      if (INVALID_INGREDIENT_DISH.has(`${ing.name}:${dish.code}`)) continue;
      for (const tagCode of POPULAR_TAGS) {
        if (INVALID_INGREDIENT_TAG.has(`${ing.name}:${tagCode}`)) continue;
        const tag = TAG_ENTRIES.find((t) => t.code === tagCode);
        if (!tag) continue;
        addPage({
          params: { ingredientIds: ing.id, dishType: dish.code, tags: tagCode },
          title: `${tag.name} ${ing.name} ${dish.name} 레시피`,
          description: `${tag.name}에 딱 맞는 ${ing.name} ${dish.name} 레시피입니다.`,
        });
      }
    }
  }

  // ── K. 영양테마 × 가격 (가성비 식단) ──
  const FITNESS_THEME_KEYS = new Set([
    "HIGH_PROTEIN", "HIGH_PROTEIN_40", "HIGH_PROTEIN_50",
    "HIGH_PROTEIN_LOW_FAT", "DIET_MEAL",
  ]);
  const FITNESS_COST_BRACKETS = [
    { value: 3000, label: "3천원" },
    { value: 5000, label: "5천원" },
  ];

  for (const theme of NUTRITION_THEMES_FOR_SEO) {
    if (!FITNESS_THEME_KEYS.has(theme.key)) continue;
    for (const cost of FITNESS_COST_BRACKETS) {
      addPage({
        params: { ...theme.params, maxCost: cost.value },
        title: `${cost.label}으로 ${theme.seoLabel} 레시피`,
        description: `${cost.label} 이하 갓성비로 ${theme.seoLabel} 레시피를 비교하세요.`,
      });
    }
  }

  // ── L. 재료 쌍 조합 (자연스러운 궁합) ──
  const INGREDIENT_PAIRS: Array<{ ids: [string, string]; names: [string, string] }> = [];
  const ingById = new Map(mainIngredients.map((i) => [i.name, i.id]));

  const PAIR_NAMES: Array<[string, string]> = [
    // 한식 대표 궁합
    ["두부", "김치"], ["삼겹살", "김치"], ["돼지고기", "김치"],
    ["소고기", "무"], ["소고기", "대파"], ["닭고기", "감자"],
    ["감자", "양파"], ["감자", "당근"], ["계란", "밥"],
    ["계란", "김치"], ["계란", "양파"], ["계란", "대파"],
    ["두부", "대파"], ["두부", "양파"], ["오징어", "양파"],
    // 다이어트/헬스
    ["닭가슴살", "고구마"], ["닭가슴살", "양배추"], ["닭가슴살", "브로콜리"],
    ["닭가슴살", "계란"], ["두부", "양배추"], ["연어", "아보카도"],
    // 양식
    ["파스타면", "양파"], ["파스타면", "베이컨"], ["파스타면", "새우"],
    ["감자", "치즈"], ["빵", "계란"], ["아보카도", "계란"],
    // 일식/중식
    ["밥", "김"], ["참치", "밥"], ["새우", "양파"],
    ["돼지고기", "양파"], ["소고기", "양파"], ["닭고기", "양파"],
    // 가성비
    ["라면", "계란"], ["라면", "김치"], ["떡볶이떡", "계란"],
    ["어묵", "대파"], ["스팸", "계란"], ["스팸", "김치"],
  ];

  for (const [name1, name2] of PAIR_NAMES) {
    const id1 = ingById.get(name1);
    const id2 = ingById.get(name2);
    if (id1 && id2) {
      INGREDIENT_PAIRS.push({ ids: [id1, id2], names: [name1, name2] });
    }
  }

  for (const pair of INGREDIENT_PAIRS) {
    addPage({
      params: { ingredientIds: `${pair.ids[0]},${pair.ids[1]}` },
      title: `${pair.names[0]} ${pair.names[1]} 레시피`,
      description: `${pair.names[0]}과 ${pair.names[1]}로 만드는 요리 레시피 모음입니다.`,
    });
  }

  // ── M. dishType × maxCost × tags (재료 없는 3D) ──
  const POPULAR_TAGS_FOR_3D = ["SOLO", "QUICK", "HEALTHY", "LATE_NIGHT", "LUNCHBOX"];
  for (const dish of DISH_TYPE_ENTRIES) {
    for (const cost of COST_BRACKETS) {
      for (const tagCode of POPULAR_TAGS_FOR_3D) {
        const tag = TAG_ENTRIES.find((t) => t.code === tagCode);
        if (!tag) continue;
        addPage({
          params: { dishType: dish.code, maxCost: cost.value, tags: tagCode },
          title: `${cost.label} 이하 ${tag.name} ${dish.name} 레시피`,
          description: `${cost.label} 이하로 만드는 ${tag.name} ${dish.name} 레시피입니다.`,
        });
      }
    }
  }

  // ── N. 시즌 키워드 (텍스트 기반) ──
  const SEASON_KEYWORDS: string[] = [
    // 봄 (3-5월)
    "냉이 레시피", "달래 무침", "달래 요리", "두릅 튀김", "두릅 요리",
    "봄나물 요리", "봄나물 비빔밥", "쑥 요리", "미나리 요리",
    // 여름 (6-8월)
    "콩국수", "냉면 만들기", "냉채 레시피", "오이냉국", "냉파스타",
    "수박화채", "팥빙수 만들기", "여름 보양식", "삼계탕 만들기",
    // 가을 (9-11월)
    "버섯전골", "꽃게탕", "대하구이", "전어구이", "가을 제철 요리",
    "고구마 요리", "밤 요리", "단호박 요리", "무생채 만들기",
    // 겨울 (12-2월)
    "어묵탕 만들기", "호빵 만들기", "군고구마", "붕어빵 만들기",
    "김장김치 만들기", "겨울 찌개", "뜨끈한 국물 요리", "호떡 만들기",
    // 명절/기념일
    "설날 요리", "추석 요리", "명절 음식", "잡채 만들기", "전 만들기",
    "크리스마스 요리", "발렌타인 디저트", "화이트데이 요리",
  ];

  for (const keyword of SEASON_KEYWORDS) {
    addPage({
      params: { q: keyword },
      title: keyword.includes("레시피") ? keyword : `${keyword} 레시피`,
      description: `${keyword}를 찾아보세요. 재료비부터 영양성분까지 비교할 수 있습니다.`,
    });
  }

  return pages;
};

// ── 재료 ID → 이름 역조회 (메타데이터 생성용) ──

const ingredientMap = new Map<string, string>();
for (const ing of MAIN_INGREDIENTS) {
  ingredientMap.set(ing.id, ing.name);
}

export const getIngredientNameById = (id: string): string | undefined =>
  ingredientMap.get(id);

export const getIngredientNamesByIds = (ids: string[]): string[] =>
  ids.map((id) => ingredientMap.get(id)).filter((n): n is string => !!n);

export { DISH_TYPE_ENTRIES as SEO_DISH_TYPE_ENTRIES };
export { TAG_ENTRIES as SEO_TAG_ENTRIES };
export { NUTRITION_THEMES_FOR_SEO };
