const INGREDIENT_MAP: ReadonlyArray<readonly [string, string]> = [
  // Vegetables
  ["양파", "yellow onion"],
  ["대파", "Korean green onion (daepa)"],
  ["쪽파", "thin green onion"],
  ["당근", "carrot"],
  ["감자", "Korean potato"],
  ["고구마", "Korean sweet potato"],
  ["애호박", "Korean zucchini"],
  ["호박", "Korean squash"],
  ["무", "Korean white radish (mu)"],
  ["배추", "napa cabbage"],
  ["양배추", "green cabbage"],
  ["청양고추", "spicy Korean green chili (cheongyang)"],
  ["풋고추", "mild Korean green chili"],
  ["홍고추", "red chili pepper"],
  ["오이", "Korean cucumber"],
  ["가지", "Asian eggplant"],
  ["버섯", "mushroom"],
  ["표고버섯", "shiitake mushroom"],
  ["새송이버섯", "king oyster mushroom"],
  ["팽이버섯", "enoki mushroom"],
  ["다진 마늘", "minced garlic"],
  ["다진마늘", "minced garlic"],
  ["마늘", "garlic clove"],
  ["생강", "ginger root"],
  ["김치", "well-fermented Korean cabbage kimchi"],
  ["깻잎", "Korean perilla leaves"],
  ["미나리", "Korean water dropwort"],
  ["부추", "Korean garlic chives"],
  ["콩나물", "soybean sprouts"],
  ["숙주", "mung bean sprouts"],
  ["시금치", "spinach"],

  // Proteins
  ["돼지고기", "pork"],
  ["삼겹살", "pork belly"],
  ["목살", "pork shoulder"],
  ["소고기", "beef"],
  ["등심", "beef sirloin"],
  ["안심", "beef tenderloin"],
  ["닭고기", "chicken"],
  ["닭다리", "chicken thigh"],
  ["닭가슴살", "chicken breast"],
  ["두부", "Korean firm tofu"],
  ["순두부", "Korean silken tofu"],
  ["오징어", "squid"],
  ["새우", "shrimp"],
  ["계란", "egg"],
  ["달걀", "egg"],

  // Special
  ["매생이", "fine silky green seaweed (Maesaengi)"],
  ["순대", "Korean blood sausage (Sundae)"],
  ["떡", "chewy rice cakes"],
];

const SEASONING_MAP: ReadonlyArray<readonly [string, string]> = [
  ["간장", "Korean soy sauce"],
  ["진간장", "dark Korean soy sauce"],
  ["국간장", "light Korean soy sauce"],
  ["고추장", "gochujang (Korean red chili paste)"],
  ["된장", "doenjang (Korean fermented soybean paste)"],
  ["고춧가루", "Korean red chili flakes (gochugaru)"],
  ["식초", "rice vinegar"],
  ["미림", "mirin"],
  ["청주", "Korean rice wine"],
  ["굴소스", "oyster sauce"],
  ["액젓", "Korean fish sauce"],
  ["멸치액젓", "Korean anchovy fish sauce"],
  ["참기름", "toasted sesame oil"],
  ["들기름", "perilla seed oil"],
  ["식용유", "neutral cooking oil"],
  ["올리브오일", "olive oil"],
  ["설탕", "white sugar"],
  ["올리고당", "Korean oligosaccharide syrup"],
  ["물엿", "Korean corn syrup (mulyeot)"],
  ["꿀", "honey"],
  ["소금", "fine sea salt"],
  ["굵은소금", "coarse sea salt"],
  ["후추", "ground black pepper"],
  ["깨", "toasted sesame seeds"],
  ["통깨", "toasted whole sesame seeds"],
];

const ACTION_MAP: ReadonlyArray<readonly [string, string]> = [
  ["손질", "cutting_board"],
  ["다듬", "cutting_board"],
  ["썰", "cutting_board"],
  ["자르", "cutting_board"],
  ["다지", "cutting_board"],
  ["볶", "stir_fry"],
  ["굽", "stir_fry"],
  ["부치", "pan_fry"],
  ["끓", "simmer"],
  ["삶", "simmer"],
  ["조리", "simmer"],
  ["무치", "mix_bowl"],
  ["비비", "mix_bowl"],
  ["섞", "mix_bowl"],
  ["휘젓", "mix_bowl"],
  ["튀기", "deep_fry"],
  ["찌", "steam_action"],
  ["찜", "steam_action"],
  ["치댄", "knead"],
  ["반죽", "knead"],
  ["체에", "sieve"],
  ["거른", "sieve"],
  ["휴지", "rest"],
  ["재워", "rest"],
  ["담", "place_into"],
  ["넣", "place_into"],
  ["붓", "place_into"],
  ["올린", "place_into"],
  ["올려", "place_into"],
];

const lookup = (
  table: ReadonlyArray<readonly [string, string]>,
  korean: string
): string | null => {
  const trimmed = korean.trim();
  if (trimmed.length === 0) return null;
  for (const [k, v] of table) {
    if (trimmed.includes(k)) return v;
  }
  return null;
};

export const translateIngredient = (korean: string): string =>
  lookup(INGREDIENT_MAP, korean) ?? korean;

export const translateSeasoning = (korean: string): string =>
  lookup(SEASONING_MAP, korean) ?? korean;

export const translateAction = (korean: string): string | null =>
  lookup(ACTION_MAP, korean);
