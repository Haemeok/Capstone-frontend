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
        id: "31",
        name: "국간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/국간장.webp`,
      },
      {
        id: "322",
        name: "진간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/진간장.webp`,
      },
      {
        id: "268",
        name: "양조간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양조간장.webp`,
      },
      {
        id: "27",
        name: "고추장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추장.webp`,
      },
      {
        id: "95",
        name: "된장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/된장.webp`,
      },
      {
        id: "252",
        name: "쌈장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌈장.webp`,
      },
      {
        id: "217",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "227",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "416",
        name: "후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/후추.webp`,
      },
      {
        id: "28",
        name: "고춧가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고춧가루.webp`,
      },
      {
        id: "63",
        name: "다진마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진마늘.webp`,
      },
      {
        id: "64",
        name: "다진생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진생강.webp`,
      },
      {
        id: "331",
        name: "참기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참기름.webp`,
      },
      {
        id: "247",
        name: "식용유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식용유.webp`,
      },
      {
        id: "295",
        name: "올리브유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리브유.webp`,
      },
      {
        id: "100",
        name: "들기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/들기름.webp`,
      },
      {
        id: "248",
        name: "식초",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식초.webp`,
      },
      {
        id: "124",
        name: "맛술",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛술.webp`,
      },
      {
        id: "151",
        name: "미림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/미림.webp`,
      },
      {
        id: "149",
        name: "물엿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/물엿.webp`,
      },
      {
        id: "293",
        name: "올리고당",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리고당.webp`,
      },
      {
        id: "51",
        name: "꿀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/꿀.webp`,
      },
      {
        id: "360",
        name: "케찹",
        imageUrl: `${IMAGE_BASE_URL}ingredients/케찹.webp`,
      },
      {
        id: "119",
        name: "마요네즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마요네즈.webp`,
      },
      {
        id: "82",
        name: "돈까스소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돈까스소스.webp`,
      },
      {
        id: "35",
        name: "굴소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/굴소스.webp`,
      },
      {
        id: "138",
        name: "멸치액젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/멸치액젓.webp`,
      },
      {
        id: "332",
        name: "참깨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참깨.webp`,
      },
      {
        id: "60",
        name: "다시마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시마.webp`,
      },
      {
        id: "59",
        name: "다시다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시다.webp`,
      },
    ],
  },
  {
    name: "기본 채소 모음",
    description: "거의 모든 요리에 활용되는 기본 채소",
    ingredients: [
      {
        id: "269",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "78",
        name: "대파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대파.webp`,
      },
      {
        id: "115",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "211",
        name: "생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생강.webp`,
      },
      {
        id: "75",
        name: "당근",
        imageUrl: `${IMAGE_BASE_URL}ingredients/당근.webp`,
      },
      {
        id: "10",
        name: "감자",
        imageUrl: `${IMAGE_BASE_URL}ingredients/감자.webp`,
      },
      {
        id: "20",
        name: "고구마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고구마.webp`,
      },
      {
        id: "144",
        name: "무",
        imageUrl: `${IMAGE_BASE_URL}ingredients/무.webp`,
      },
      {
        id: "170",
        name: "배추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/배추.webp`,
      },
      {
        id: "263",
        name: "애호박",
        imageUrl: `${IMAGE_BASE_URL}ingredients/애호박.webp`,
      },
      {
        id: "24",
        name: "고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추.webp`,
      },
      {
        id: "341",
        name: "청고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청고추.webp`,
      },
      {
        id: "343",
        name: "청양고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청양고추.webp`,
      },
      {
        id: "173",
        name: "버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버섯.webp`,
      },
      {
        id: "206",
        name: "새송이버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/새송이버섯.webp`,
      },
      {
        id: "390",
        name: "팽이버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/팽이버섯.webp`,
      },
      {
        id: "373",
        name: "토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토.webp`,
      },
      {
        id: "168",
        name: "방울토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/방울토마토.webp`,
      },
      {
        id: "286",
        name: "오이",
        imageUrl: `${IMAGE_BASE_URL}ingredients/오이.webp`,
      },
      {
        id: "265",
        name: "양배추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양배추.webp`,
      },
      {
        id: "191",
        name: "브로콜리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/브로콜리.webp`,
      },
      {
        id: "243",
        name: "시금치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/시금치.webp`,
      },
      {
        id: "366",
        name: "콩나물",
        imageUrl: `${IMAGE_BASE_URL}ingredients/콩나물.webp`,
      },
      {
        id: "233",
        name: "숙주",
        imageUrl: `${IMAGE_BASE_URL}ingredients/숙주.webp`,
      },
      {
        id: "387",
        name: "파프리카",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파프리카.webp`,
      },
      {
        id: "46",
        name: "깻잎",
        imageUrl: `${IMAGE_BASE_URL}ingredients/깻잎.webp`,
      },
      {
        id: "205",
        name: "상추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/상추.webp`,
      },
    ],
  },
  {
    name: "육류 기본 모음",
    description: "다양한 요리에 활용되는 기본 육류",
    ingredients: [
      {
        id: "221",
        name: "소고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소고기.webp`,
      },
      {
        id: "94",
        name: "돼지고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지고기.webp`,
      },
      {
        id: "71",
        name: "닭고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭고기.webp`,
      },
      {
        id: "70",
        name: "닭가슴살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭가슴살.webp`,
      },
      {
        id: "73",
        name: "닭다리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/닭다리.webp`,
      },
      {
        id: "203",
        name: "삼겹살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/삼겹살.webp`,
      },
      {
        id: "79",
        name: "대패삼겹살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대패삼겹살.webp`,
      },
      {
        id: "90",
        name: "돼지 목살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지 목살.webp`,
      },
      {
        id: "65",
        name: "다진소고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진소고기.webp`,
      },
      {
        id: "62",
        name: "다진돼지고기",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진돼지고기.webp`,
      },
      {
        id: "176",
        name: "베이컨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이컨.webp`,
      },
      {
        id: "404",
        name: "햄",
        imageUrl: `${IMAGE_BASE_URL}ingredients/햄.webp`,
      },
      {
        id: "230",
        name: "소세지",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소세지.webp`,
      },
      {
        id: "222",
        name: "소고기 갈비",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소고기 갈비.webp`,
      },
      {
        id: "86",
        name: "돼지 갈비",
        imageUrl: `${IMAGE_BASE_URL}ingredients/돼지 갈비.webp`,
      },
      {
        id: "330",
        name: "차돌박이",
        imageUrl: `${IMAGE_BASE_URL}ingredients/차돌박이.webp`,
      },
    ],
  },
  {
    name: "자취 기본 재료 모음",
    description: "자취생이라면 냉장고에 꼭 있어야 할 필수 재료",
    ingredients: [
      {
        id: "19",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "304",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "174",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "351",
        name: "치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/치즈.webp`,
      },
      {
        id: "249",
        name: "쌀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌀.webp`,
      },
      {
        id: "110",
        name: "라면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/라면.webp`,
      },
      {
        id: "240",
        name: "스파게티면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/스파게티면.webp`,
      },
      {
        id: "41",
        name: "김치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/김치.webp`,
      },
      {
        id: "377",
        name: "통조림참치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통조림참치.webp`,
      },
      {
        id: "376",
        name: "통조림옥수수",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통조림옥수수.webp`,
      },
      {
        id: "374",
        name: "토마토소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토소스.webp`,
      },
      {
        id: "120",
        name: "만두",
        imageUrl: `${IMAGE_BASE_URL}ingredients/만두.webp`,
      },
      {
        id: "122",
        name: "맛살",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛살.webp`,
      },
      {
        id: "61",
        name: "다시팩",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시팩.webp`,
      },
      {
        id: "148",
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
        id: "19",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "304",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "174",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "217",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "227",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "178",
        name: "베이킹파우더",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이킹파우더.webp`,
      },
      {
        id: "177",
        name: "베이킹소다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/베이킹소다.webp`,
      },
      {
        id: "418",
        name: "휘핑크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/휘핑크림.webp`,
      },
      {
        id: "215",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "368",
        name: "크림치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/크림치즈.webp`,
      },
      {
        id: "347",
        name: "초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/초콜릿.webp`,
      },
      {
        id: "66",
        name: "다크초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다크초콜릿.webp`,
      },
      {
        id: "413",
        name: "화이트초콜릿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/화이트초콜릿.webp`,
      },
      {
        id: "51",
        name: "꿀",
        imageUrl: `${IMAGE_BASE_URL}ingredients/꿀.webp`,
      },
      {
        id: "280",
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
        id: "304",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "174",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "351",
        name: "치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/치즈.webp`,
      },
      {
        id: "241",
        name: "슬라이스치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/슬라이스치즈.webp`,
      },
      {
        id: "142",
        name: "모짜렐라치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/모짜렐라치즈.webp`,
      },
      {
        id: "345",
        name: "체다치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/체다치즈.webp`,
      },
      {
        id: "382",
        name: "파마산치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파마산치즈.webp`,
      },
      {
        id: "368",
        name: "크림치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/크림치즈.webp`,
      },
      {
        id: "184",
        name: "부라타치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/부라타치즈.webp`,
      },
      {
        id: "215",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "418",
        name: "휘핑크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/휘핑크림.webp`,
      },
      {
        id: "298",
        name: "요구르트",
        imageUrl: `${IMAGE_BASE_URL}ingredients/요구르트.webp`,
      },
      {
        id: "38",
        name: "그릭요거트",
        imageUrl: `${IMAGE_BASE_URL}ingredients/그릭요거트.webp`,
      },
      {
        id: "280",
        name: "연유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/연유.webp`,
      },
      {
        id: "99",
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
        id: "31",
        name: "국간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/국간장.webp`,
      },
      {
        id: "322",
        name: "진간장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/진간장.webp`,
      },
      {
        id: "27",
        name: "고추장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추장.webp`,
      },
      {
        id: "95",
        name: "된장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/된장.webp`,
      },
      {
        id: "252",
        name: "쌈장",
        imageUrl: `${IMAGE_BASE_URL}ingredients/쌈장.webp`,
      },
      {
        id: "28",
        name: "고춧가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고춧가루.webp`,
      },
      {
        id: "63",
        name: "다진마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진마늘.webp`,
      },
      {
        id: "64",
        name: "다진생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다진생강.webp`,
      },
      {
        id: "331",
        name: "참기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참기름.webp`,
      },
      {
        id: "332",
        name: "참깨",
        imageUrl: `${IMAGE_BASE_URL}ingredients/참깨.webp`,
      },
      {
        id: "100",
        name: "들기름",
        imageUrl: `${IMAGE_BASE_URL}ingredients/들기름.webp`,
      },
      {
        id: "247",
        name: "식용유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식용유.webp`,
      },
      {
        id: "138",
        name: "멸치액젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/멸치액젓.webp`,
      },
      {
        id: "208",
        name: "새우젓",
        imageUrl: `${IMAGE_BASE_URL}ingredients/새우젓.webp`,
      },
      {
        id: "60",
        name: "다시마",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시마.webp`,
      },
      {
        id: "61",
        name: "다시팩",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시팩.webp`,
      },
      {
        id: "59",
        name: "다시다",
        imageUrl: `${IMAGE_BASE_URL}ingredients/다시다.webp`,
      },
      {
        id: "124",
        name: "맛술",
        imageUrl: `${IMAGE_BASE_URL}ingredients/맛술.webp`,
      },
      {
        id: "151",
        name: "미림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/미림.webp`,
      },
      {
        id: "217",
        name: "설탕",
        imageUrl: `${IMAGE_BASE_URL}ingredients/설탕.webp`,
      },
      {
        id: "227",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "248",
        name: "식초",
        imageUrl: `${IMAGE_BASE_URL}ingredients/식초.webp`,
      },
      {
        id: "149",
        name: "물엿",
        imageUrl: `${IMAGE_BASE_URL}ingredients/물엿.webp`,
      },
      {
        id: "269",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "78",
        name: "대파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/대파.webp`,
      },
      {
        id: "115",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "211",
        name: "생강",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생강.webp`,
      },
      {
        id: "341",
        name: "청고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/청고추.webp`,
      },
      {
        id: "24",
        name: "고추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/고추.webp`,
      },
      {
        id: "144",
        name: "무",
        imageUrl: `${IMAGE_BASE_URL}ingredients/무.webp`,
      },
      {
        id: "41",
        name: "김치",
        imageUrl: `${IMAGE_BASE_URL}ingredients/김치.webp`,
      },
      {
        id: "19",
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
        id: "227",
        name: "소금",
        imageUrl: `${IMAGE_BASE_URL}ingredients/소금.webp`,
      },
      {
        id: "416",
        name: "후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/후추.webp`,
      },
      {
        id: "379",
        name: "통후추",
        imageUrl: `${IMAGE_BASE_URL}ingredients/통후추.webp`,
      },
      {
        id: "295",
        name: "올리브유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/올리브유.webp`,
      },
      {
        id: "174",
        name: "버터",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버터.webp`,
      },
      {
        id: "115",
        name: "마늘",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘.webp`,
      },
      {
        id: "116",
        name: "마늘가루",
        imageUrl: `${IMAGE_BASE_URL}ingredients/마늘가루.webp`,
      },
      {
        id: "269",
        name: "양파",
        imageUrl: `${IMAGE_BASE_URL}ingredients/양파.webp`,
      },
      {
        id: "373",
        name: "토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토.webp`,
      },
      {
        id: "168",
        name: "방울토마토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/방울토마토.webp`,
      },
      {
        id: "374",
        name: "토마토소스",
        imageUrl: `${IMAGE_BASE_URL}ingredients/토마토소스.webp`,
      },
      {
        id: "382",
        name: "파마산치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파마산치즈.webp`,
      },
      {
        id: "142",
        name: "모짜렐라치즈",
        imageUrl: `${IMAGE_BASE_URL}ingredients/모짜렐라치즈.webp`,
      },
      {
        id: "215",
        name: "생크림",
        imageUrl: `${IMAGE_BASE_URL}ingredients/생크림.webp`,
      },
      {
        id: "304",
        name: "우유",
        imageUrl: `${IMAGE_BASE_URL}ingredients/우유.webp`,
      },
      {
        id: "163",
        name: "바질페스토",
        imageUrl: `${IMAGE_BASE_URL}ingredients/바질페스토.webp`,
      },
      {
        id: "162",
        name: "바질",
        imageUrl: `${IMAGE_BASE_URL}ingredients/바질.webp`,
      },
      {
        id: "283",
        name: "오레가노",
        imageUrl: `${IMAGE_BASE_URL}ingredients/오레가노.webp`,
      },
      {
        id: "384",
        name: "파슬리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파슬리.webp`,
      },
      {
        id: "114",
        name: "로즈마리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/로즈마리.webp`,
      },
      {
        id: "371",
        name: "타임",
        imageUrl: `${IMAGE_BASE_URL}ingredients/타임.webp`,
      },
      {
        id: "165",
        name: "발사믹",
        imageUrl: `${IMAGE_BASE_URL}ingredients/발사믹.webp`,
      },
      {
        id: "113",
        name: "레몬즙",
        imageUrl: `${IMAGE_BASE_URL}ingredients/레몬즙.webp`,
      },
      {
        id: "240",
        name: "스파게티면",
        imageUrl: `${IMAGE_BASE_URL}ingredients/스파게티면.webp`,
      },
      {
        id: "19",
        name: "계란",
        imageUrl: `${IMAGE_BASE_URL}ingredients/계란.webp`,
      },
      {
        id: "75",
        name: "당근",
        imageUrl: `${IMAGE_BASE_URL}ingredients/당근.webp`,
      },
      {
        id: "210",
        name: "샐러리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/샐러리.webp`,
      },
      {
        id: "387",
        name: "파프리카",
        imageUrl: `${IMAGE_BASE_URL}ingredients/파프리카.webp`,
      },
      {
        id: "173",
        name: "버섯",
        imageUrl: `${IMAGE_BASE_URL}ingredients/버섯.webp`,
      },
      {
        id: "191",
        name: "브로콜리",
        imageUrl: `${IMAGE_BASE_URL}ingredients/브로콜리.webp`,
      },
    ],
  },
];
