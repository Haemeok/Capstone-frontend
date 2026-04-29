import type { IngredientItem } from "@/entities/ingredient";

export type IngredientRole =
  | "vegetable"
  | "meat"
  | "seasoning_main"
  | "seasoning_minor"
  | "other";

const VEGETABLE_KEYWORDS = [
  "양파",
  "대파",
  "쪽파",
  "당근",
  "감자",
  "고구마",
  "애호박",
  "호박",
  "무",
  "배추",
  "양배추",
  "청양고추",
  "풋고추",
  "홍고추",
  "오이",
  "가지",
  "버섯",
  "마늘",
  "생강",
  "김치",
  "깻잎",
  "미나리",
  "부추",
  "콩나물",
  "숙주",
  "시금치",
  "파프리카",
  "피망",
];

const MEAT_KEYWORDS = [
  "돼지고기",
  "삼겹살",
  "목살",
  "앞다리",
  "뒷다리",
  "소고기",
  "등심",
  "안심",
  "갈비",
  "차돌박이",
  "닭고기",
  "닭다리",
  "닭가슴살",
  "닭날개",
  "두부",
  "순두부",
  "유부",
  "오징어",
  "새우",
  "조개",
  "주꾸미",
  "낙지",
  "문어",
  "계란",
  "달걀",
  "메추리알",
  "햄",
  "베이컨",
  "소시지",
  "참치",
];

const MAIN_SEASONING_KEYWORDS = [
  "간장",
  "진간장",
  "국간장",
  "고추장",
  "된장",
  "쌈장",
  "굴소스",
  "액젓",
  "멸치액젓",
  "참기름",
  "들기름",
  "식용유",
  "올리브오일",
  "물엿",
  "올리고당",
  "꿀",
  "조청",
  "고춧가루",
  "미림",
  "맛술",
  "청주",
];

const MINOR_SEASONING_KEYWORDS = [
  "소금",
  "후추",
  "깨",
  "통깨",
  "흑임자",
  "설탕",
];

const MINOR_AMOUNT_UNITS = new Set(["작은술", "꼬집", "톨", "약간"]);
const SPOON_LIKE_UNITS = new Set([
  "큰술",
  "큰스푼",
  "스푼",
  "T",
  "Tbsp",
  "tbsp",
]);

const SMALL_GRAM_THRESHOLD = 5;

const containsAny = (haystack: string, needles: readonly string[]): boolean =>
  needles.some((n) => haystack.includes(n));

const isSmallQuantity = (
  quantity: string | undefined,
  unit: string
): boolean => {
  if (MINOR_AMOUNT_UNITS.has(unit)) return true;
  if (!quantity) return false;
  if (quantity.includes("약간") || quantity.includes("조금")) return true;
  if (unit === "g") {
    const num = Number(quantity);
    if (Number.isFinite(num) && num > 0 && num < SMALL_GRAM_THRESHOLD)
      return true;
  }
  return false;
};

export const classifyIngredient = (item: IngredientItem): IngredientRole => {
  const name = item.name ?? "";

  if (containsAny(name, MEAT_KEYWORDS)) return "meat";
  if (containsAny(name, VEGETABLE_KEYWORDS)) return "vegetable";

  const isKnownMain = containsAny(name, MAIN_SEASONING_KEYWORDS);
  const isKnownMinor = containsAny(name, MINOR_SEASONING_KEYWORDS);

  if (isKnownMinor && !isKnownMain) {
    return "seasoning_minor";
  }
  if (isKnownMain) {
    if (isSmallQuantity(item.quantity, item.unit)) {
      return "seasoning_minor";
    }
    if (SPOON_LIKE_UNITS.has(item.unit)) {
      return "seasoning_main";
    }
    return "seasoning_main";
  }

  return "other";
};
