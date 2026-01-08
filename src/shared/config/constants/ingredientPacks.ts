import { IMAGE_BASE_URL } from "./recipe";

export type IngredientPack = {
  name: string;
  description: string;
  ingredients: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
};

export const INGREDIENT_PACKS: IngredientPack[] = [
  {
    name: "조미료/양념 모음",
    description: "모든 요리의 기본이 되는 필수 양념재료",
    ingredients: [
      {
        id: "8LB17Jkg",
        name: "국간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/국간장.webp`,
      },
      {
        id: "gLe7j1Bx",
        name: "진간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/진간장.webp`,
      },
      {
        id: "6Ye9Gmwb",
        name: "양조간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양조간장.webp`,
      },
      {
        id: "gXwPmBKl",
        name: "고추장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추장.webp`,
      },
      {
        id: "mKe6x0w9",
        name: "된장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/된장.webp`,
      },
      {
        id: "N8eA3Rwq",
        name: "쌈장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌈장.webp`,
      },
      {
        id: "mxBKDpe5",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "gXwP6reK",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "RyJVrgJd",
        name: "후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/후추.webp`,
      },
      {
        id: "Eqeq2JG5",
        name: "고춧가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고춧가루.webp`,
      },
      {
        id: "5Gez84wA",
        name: "다진마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진마늘.webp`,
      },
      {
        id: "7realnBA",
        name: "다진생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진생강.webp`,
      },
      {
        id: "8LB1yMBk",
        name: "참기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참기름.webp`,
      },
      {
        id: "60J358BM",
        name: "식용유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식용유.webp`,
      },
      {
        id: "mKe6gPJ9",
        name: "올리브유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리브유.webp`,
      },
      {
        id: "KzJRGVwl",
        name: "들기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/들기름.webp`,
      },
      {
        id: "vKBpL2BN",
        name: "식초",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식초.webp`,
      },
      {
        id: "6Ye926Jb",
        name: "맛술",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛술.webp`,
      },
      {
        id: "mKe62oe9",
        name: "미림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/미림.webp`,
      },
      {
        id: "X1Bo9AJN",
        name: "물엿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/물엿.webp`,
      },
      {
        id: "X1BopReN",
        name: "올리고당",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리고당.webp`,
      },
      {
        id: "mKe6G0J9",
        name: "꿀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/꿀.webp`,
      },
      {
        id: "RyJVYYed",
        name: "케찹",
        imageUrl: `${IMAGE_BASE_URL}ingredients/케찹.webp`,
      },
      {
        id: "5GezWYJA",
        name: "마요네즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마요네즈.webp`,
      },
      {
        id: "GAB2G8eZ",
        name: "돈까스소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돈까스소스.webp`,
      },
      {
        id: "9yerABEa",
        name: "굴소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/굴소스.webp`,
      },
      {
        id: "GAB2xEJZ",
        name: "멸치액젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/멸치액젓.webp`,
      },
      {
        id: "pqJnGQw5",
        name: "참깨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참깨.webp`,
      },
      {
        id: "RyJVO6wd",
        name: "다시마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시마.webp`,
      },
      {
        id: "3zejzAe4",
        name: "다시다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시다.webp`,
      },
    ],
  },
  {
    name: "육류 기본 모음",
    description: "다양한 요리에 활용되는 기본 육류",
    ingredients: [
      {
        id: "7Kellbea",
        name: "소고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소고기.webp`,
      },
      {
        id: "jzw59yw4",
        name: "돼지고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지고기.webp`,
      },
      {
        id: "gXwPvmeK",
        name: "닭고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭고기.webp`,
      },
      {
        id: "NjeWM2wD",
        name: "닭가슴살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭가슴살.webp`,
      },
      {
        id: "doJQADJO",
        name: "닭다리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭다리.webp`,
      },
      {
        id: "60J378JM",
        name: "삼겹살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/삼겹살.webp`,
      },
      {
        id: "9yer9ABE",
        name: "대패삼겹살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대패삼겹살.webp`,
      },
      {
        id: "YWwYkkeo",
        name: "돼지 목살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지 목살.webp`,
      },
      {
        id: "7KelbEwa",
        name: "다진소고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진소고기.webp`,
      },
      {
        id: "MWwyl7J3",
        name: "다진돼지고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진돼지고기.webp`,
      },
      {
        id: "pqJnvzJ5",
        name: "베이컨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이컨.webp`,
      },
      {
        id: "vKBpYxeN",
        name: "햄",
        imageUrl: `${IMAGE_BASE_URL}ingredients/햄.webp`,
      },
      {
        id: "blJxkzeA",
        name: "소세지",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소세지.webp`,
      },
      {
        id: "gLe7alwx",
        name: "소고기 갈비",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소고기 갈비.webp`,
      },
      {
        id: "3ZJD4PJ6",
        name: "돼지 갈비",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지 갈비.webp`,
      },
      {
        id: "blJxLYJA",
        name: "차돌박이",
        imageUrl: `${IMAGE_BASE_URL}ingredients/차돌박이.webp`,
      },
    ],
  },
  {
    name: "채소 기본 재료",
    description: "다양한 요리에 활용되는 기본 채소",
    ingredients: [
      {
        id: "MzwvZbwQ",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "G0J8ZDBv",
        name: "대파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대파.webp`,
      },
      {
        id: "3zejjZe4",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "qjeZoLJp",
        name: "생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생강.webp`,
      },
      {
        id: "8LB1p7wk",
        name: "당근",
        imageUrl: `${IMAGE_BASE_URL}ingredients/당근.webp`,
      },
      {
        id: "ArBNmwkp",
        name: "감자",
        imageUrl: `${IMAGE_BASE_URL}ingredients/감자.webp`,
      },
      {
        id: "7reanJAg",
        name: "고구마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고구마.webp`,
      },
      {
        id: "KzJR8VBl",
        name: "무",
        imageUrl: `${IMAGE_BASE_URL}ingredients/무.webp`,
      },
      {
        id: "NjeWZXBD",
        name: "배추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/배추.webp`,
      },
      {
        id: "5GezPQwA",
        name: "애호박",
        imageUrl: `${IMAGE_BASE_URL}ingredients/애호박.webp`,
      },
      {
        id: "6Ye9kwbE",
        name: "고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추.webp`,
      },
      {
        id: "OAeL16JL",
        name: "청고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청고추.webp`,
      },
      {
        id: "RgBMjLez",
        name: "청양고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청양고추.webp`,
      },
      {
        id: "doJQGNBO",
        name: "버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버섯.webp`,
      },
      {
        id: "jzw5loJ4",
        name: "새송이버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/새송이버섯.webp`,
      },
      {
        id: "YWwYoreo",
        name: "팽이버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/팽이버섯.webp`,
      },
      {
        id: "doJQogBO",
        name: "토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토.webp`,
      },
      {
        id: "6Ye906Bb",
        name: "방울토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/방울토마토.webp`,
      },
      {
        id: "3ZJDxVJ6",
        name: "오이",
        imageUrl: `${IMAGE_BASE_URL}ingredients/오이.webp`,
      },
      {
        id: "7KelMbJa",
        name: "양배추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양배추.webp`,
      },
      {
        id: "60J37vJM",
        name: "브로콜리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/브로콜리.webp`,
      },
      {
        id: "RgBMrOez",
        name: "시금치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/시금치.webp`,
      },
      {
        id: "gLe7k1ex",
        name: "콩나물",
        imageUrl: `${IMAGE_BASE_URL}ingredients/콩나물.webp`,
      },
      {
        id: "mjeXW1B8",
        name: "숙주",
        imageUrl: `${IMAGE_BASE_URL}ingredients/숙주.webp`,
      },
      {
        id: "RgBMdLwz",
        name: "파프리카",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파프리카.webp`,
      },
      {
        id: "YWwYnkBo",
        name: "깻잎",
        imageUrl: `${IMAGE_BASE_URL}ingredients/깻잎.webp`,
      },
      {
        id: "X1BoWRBN",
        name: "상추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/상추.webp`,
      },
    ],
  },
  {
    name: "자취 기본 재료 모음",
    description: "자취생이라면 냉장고에 꼭 있어야 할 필수 재료",
    ingredients: [
      {
        id: "5Gez4wA9",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "vKBpozwN",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "blJxKOeA",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "mKe607w9",
        name: "치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/치즈.webp`,
      },
      {
        id: "X1BoaRJN",
        name: "쌀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌀.webp`,
      },
      {
        id: "ArBNopek",
        name: "라면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/라면.webp`,
      },
      {
        id: "1beE6mJg",
        name: "스파게티면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/스파게티면.webp`,
      },
      {
        id: "OAeLoBLq",
        name: "김치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/김치.webp`,
      },
      {
        id: "mjeXMRJ8",
        name: "통조림참치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통조림참치.webp`,
      },
      {
        id: "pqJnxQB5",
        name: "통조림옥수수",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통조림옥수수.webp`,
      },
      {
        id: "blJx9YwA",
        name: "토마토소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토소스.webp`,
      },
      {
        id: "7reaxOBA",
        name: "만두",
        imageUrl: `${IMAGE_BASE_URL}ingredients/만두.webp`,
      },
      {
        id: "gLe7lDJx",
        name: "맛살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛살.webp`,
      },
      {
        id: "mxBKYWJ5",
        name: "다시팩",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시팩.webp`,
      },
      {
        id: "vKBpkDwN",
        name: "물",
        imageUrl: `${IMAGE_BASE_URL}ingredients/물.webp`,
      },
    ],
  },
  {
    name: "베이킹 기본 재료",
    description: "홈베이킹에 필요한 기본 재료 모음",
    ingredients: [
      {
        id: "5Gez4wA9",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "vKBpozwN",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "blJxKOeA",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "mxBKDpe5",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "gXwP6reK",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "G0J89lwv",
        name: "베이킹파우더",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이킹파우더.webp`,
      },
      {
        id: "mjeXy6J8",
        name: "베이킹소다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이킹소다.webp`,
      },
      {
        id: "MWwyV3B3",
        name: "휘핑크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/휘핑크림.webp`,
      },
      {
        id: "3zejmqB4",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "6Ye9nNJb",
        name: "크림치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/크림치즈.webp`,
      },
      {
        id: "60J3nmeM",
        name: "초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/초콜릿.webp`,
      },
      {
        id: "gLe7N3Bx",
        name: "다크초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다크초콜릿.webp`,
      },
      {
        id: "GzBk5pJm",
        name: "화이트초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/화이트초콜릿.webp`,
      },
      {
        id: "mKe6G0J9",
        name: "꿀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/꿀.webp`,
      },
      {
        id: "Y6wGrvJ1",
        name: "연유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/연유.webp`,
      },
    ],
  },
  {
    name: "유제품 모음",
    description: "다양한 요리와 음료에 활용되는 유제품",
    ingredients: [
      {
        id: "vKBpozwN",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "blJxKOeA",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "mKe607w9",
        name: "치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/치즈.webp`,
      },
      {
        id: "OAeLlpeL",
        name: "슬라이스치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/슬라이스치즈.webp`,
      },
      {
        id: "3ZJDYgw6",
        name: "모짜렐라치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/모짜렐라치즈.webp`,
      },
      {
        id: "Z6edV3wx",
        name: "체다치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/체다치즈.webp`,
      },
      {
        id: "GAB29YwZ",
        name: "파마산치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파마산치즈.webp`,
      },
      {
        id: "6Ye9nNJb",
        name: "크림치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/크림치즈.webp`,
      },
      {
        id: "1beEL2Bg",
        name: "부라타치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/부라타치즈.webp`,
      },
      {
        id: "3zejmqB4",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "MWwyV3B3",
        name: "휘핑크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/휘핑크림.webp`,
      },
      {
        id: "ArBN43Jk",
        name: "요구르트",
        imageUrl: `${IMAGE_BASE_URL}ingredients/요구르트.webp`,
      },
      {
        id: "GAB28JZX",
        name: "그릭요거트",
        imageUrl: `${IMAGE_BASE_URL}ingredients/그릭요거트.webp`,
      },
      {
        id: "Y6wGrvJ1",
        name: "연유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/연유.webp`,
      },
      {
        id: "qjeZqNBp",
        name: "두유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/두유.webp`,
      },
    ],
  },
  {
    name: "한식 기본 베이스",
    description: "한식 요리를 위한 필수 조미료와 재료",
    ingredients: [
      {
        id: "8LB17Jkg",
        name: "국간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/국간장.webp`,
      },
      {
        id: "gLe7j1Bx",
        name: "진간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/진간장.webp`,
      },
      {
        id: "gXwPmBKl",
        name: "고추장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추장.webp`,
      },
      {
        id: "mKe6x0w9",
        name: "된장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/된장.webp`,
      },
      {
        id: "N8eA3Rwq",
        name: "쌈장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌈장.webp`,
      },
      {
        id: "Eqeq2JG5",
        name: "고춧가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고춧가루.webp`,
      },
      {
        id: "5Gez84wA",
        name: "다진마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진마늘.webp`,
      },
      {
        id: "7realnBA",
        name: "다진생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진생강.webp`,
      },
      {
        id: "8LB1yMBk",
        name: "참기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참기름.webp`,
      },
      {
        id: "pqJnGQw5",
        name: "참깨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참깨.webp`,
      },
      {
        id: "KzJRGVwl",
        name: "들기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/들기름.webp`,
      },
      {
        id: "60J358BM",
        name: "식용유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식용유.webp`,
      },
      {
        id: "GAB2xEJZ",
        name: "멸치액젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/멸치액젓.webp`,
      },
      {
        id: "N8eAPRBq",
        name: "새우젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/새우젓.webp`,
      },
      {
        id: "RyJVO6wd",
        name: "다시마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시마.webp`,
      },
      {
        id: "mxBKYWJ5",
        name: "다시팩",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시팩.webp`,
      },
      {
        id: "3zejzAe4",
        name: "다시다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시다.webp`,
      },
      {
        id: "6Ye926Jb",
        name: "맛술",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛술.webp`,
      },
      {
        id: "mKe62oe9",
        name: "미림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/미림.webp`,
      },
      {
        id: "mxBKDpe5",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "gXwP6reK",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "vKBpL2BN",
        name: "식초",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식초.webp`,
      },
      {
        id: "X1Bo9AJN",
        name: "물엿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/물엿.webp`,
      },
      {
        id: "MzwvZbwQ",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "G0J8ZDBv",
        name: "대파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대파.webp`,
      },
      {
        id: "3zejjZe4",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "qjeZoLJp",
        name: "생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생강.webp`,
      },
      {
        id: "OAeL16JL",
        name: "청고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청고추.webp`,
      },
      {
        id: "6Ye9kwbE",
        name: "고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추.webp`,
      },
      {
        id: "KzJR8VBl",
        name: "무",
        imageUrl: `${IMAGE_BASE_URL}ingredients/무.webp`,
      },
      {
        id: "OAeLoBLq",
        name: "김치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/김치.webp`,
      },
      {
        id: "5Gez4wA9",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
    ],
  },
  {
    name: "양식 기본 베이스",
    description: "양식 요리를 위한 필수 조미료와 재료",
    ingredients: [
      {
        id: "gXwP6reK",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "RyJVrgJd",
        name: "후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/후추.webp`,
      },
      {
        id: "9yerxzwE",
        name: "통후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통후추.webp`,
      },
      {
        id: "mKe6gPJ9",
        name: "올리브유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리브유.webp`,
      },
      {
        id: "blJxKOeA",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "3zejjZe4",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "RyJVd7Bd",
        name: "마늘가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘가루.webp`,
      },
      {
        id: "MzwvZbwQ",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "doJQogBO",
        name: "토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토.webp`,
      },
      {
        id: "6Ye906Bb",
        name: "방울토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/방울토마토.webp`,
      },
      {
        id: "blJx9YwA",
        name: "토마토소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토소스.webp`,
      },
      {
        id: "GAB29YwZ",
        name: "파마산치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파마산치즈.webp`,
      },
      {
        id: "3ZJDYgw6",
        name: "모짜렐라치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/모짜렐라치즈.webp`,
      },
      {
        id: "3zejmqB4",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "vKBpozwN",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "5GezKYJA",
        name: "바질페스토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/바질페스토.webp`,
      },
      {
        id: "MWwyKke3",
        name: "바질",
        imageUrl: `${IMAGE_BASE_URL}ingredients/바질.webp`,
      },
      {
        id: "Olw021e9",
        name: "오레가노",
        imageUrl: `${IMAGE_BASE_URL}ingredients/오레가노.webp`,
      },
      {
        id: "1beE2pJg",
        name: "파슬리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파슬리.webp`,
      },
      {
        id: "RMBblrJ5",
        name: "로즈마리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/로즈마리.webp`,
      },
      {
        id: "gXwPp9wK",
        name: "타임",
        imageUrl: `${IMAGE_BASE_URL}ingredients/타임.webp`,
      },
      {
        id: "7Kely5Ja",
        name: "발사믹",
        imageUrl: `${IMAGE_BASE_URL}ingredients/발사믹.webp`,
      },
      {
        id: "GzBkVzwm",
        name: "레몬즙",
        imageUrl: `${IMAGE_BASE_URL}ingredients/레몬즙.webp`,
      },
      {
        id: "1beE6mJg",
        name: "스파게티면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/스파게티면.webp`,
      },
      {
        id: "5Gez4wA9",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "8LB1p7wk",
        name: "당근",
        imageUrl: `${IMAGE_BASE_URL}ingredients/당근.webp`,
      },
      {
        id: "ArBN83Jk",
        name: "샐러리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/샐러리.webp`,
      },
      {
        id: "RgBMdLwz",
        name: "파프리카",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파프리카.webp`,
      },
      {
        id: "doJQGNBO",
        name: "버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버섯.webp`,
      },
      {
        id: "60J37vJM",
        name: "브로콜리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/브로콜리.webp`,
      },
    ],
  },
];
