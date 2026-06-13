import type { AiRecipeDict } from "../../types";

export const aiRecipe: AiRecipeDict = {
  modelSelectHeading: "어떤 AI와 함께 요리할까요?",
  loginDrawerMessage: "AI와 함께 레시피를 만들어보세요!",
  backToModelSelect: "AI 다시 선택하기",
  generateRecipe: "레시피 생성하기",
  errorFallback: "AI 레시피 생성 중 문제가 발생했어요",
  loading: {
    titleSuffix: "레시피를 만들고 있어요",
    progressLabel: "진행률",
    tipHeading: "💡 잠깐!",
    tipBody: [
      "다른 작업을 해도 괜찮아요!",
      "다른 페이지를 둘러보시거나 냉장고를 확인해보세요.",
      "레시피가 완성되면 알려드릴게요.",
    ],
    eta: "보통 2~3분 정도 걸려요",
  },
  error: {
    defaultMessage: "레시피 생성 중 오류가 발생했습니다.",
    failureHeading: "레시피 생성 실패",
    failureBody: "레시피 생성 중 문제가 발생했습니다.",
    retryButton: "다시 시도하기",
    persistentTip: "문제가 계속 발생하면 잠시 후 다시 시도해주세요.",
  },
  models: {
    INGREDIENT_FOCUS: {
      name: "냉장고 속 재료",
      description: "집에 있는 재료로 만드는 최고의 요리",
    },
    COST_EFFECTIVE: {
      name: "가성비 요리",
      description: "만원의 행복! 저렴하지만 근사하게",
    },
    NUTRITION_BALANCE: {
      name: "영양 밸런스",
      description: "탄단지 비율과 칼로리까지 꼼꼼하게",
    },
    FINE_DINING: {
      name: "파인 다이닝",
      description: "우리 집 식탁을 고급 레스토랑처럼",
    },
  },
  steps: [
    "재료를 분석하고 있어요",
    "맛있는 조합을 찾고 있어요",
    "요리 순서를 정리하고 있어요",
    "마지막 손질을 하고 있어요",
    "레시피를 완성하고 있어요",
  ],
  diningTiers: {
    BLACK: {
      label: "블랙",
      description: "모던하고 혁신적인 미식",
      features: [
        "대중적인 재료 사용",
        "파인다이닝 조리법",
        "중급자 난이도",
        "일반 조리도구",
      ],
    },
    WHITE: {
      label: "화이트",
      description: "정통 파인다이닝의 우아함",
      features: [
        "고급 재료 포함 가능",
        "정교한 조리법",
        "상급자 난이도",
        "전문 조리도구 필요",
      ],
    },
  },
  price: {
    pageTitle: "가성비 레시피 생성 | Recipio",
    pageDescription:
      "예산에 맞는 가성비 레시피를 AI가 생성해드립니다. 직장인 평균 한끼보다 저렴하게 맛있는 요리를 즐겨보세요.",
    headerTitle: "가성비 레시피 생성",
    headerDescription:
      "예산과 선호하는 음식 종류를 선택하면 딱 맞는 가성비 레시피를 생성해드려요",
    budgetLabel: "목표 예산",
    foodPickHeading: "어떤 음식이 땡기시나요?",
    foodPickDescription: "선호하는 음식 종류를 선택해주세요",
    averageMealInfo: "직장인 평균 한끼 예산({price}원)이에요",
    savingsMessage: "직장인 평균 한끼보다 {savings}원 절약해요!",
    monthlySavingsMessage: "매일 이렇게 드시면 한 달에 {months}만 원 아껴요!",
    savingsBadgeLabel: "이번 달 절약 가능",
    savingsBadgeSuffix: "절약 중!",
    dailyPracticeTip: "매일 한 끼씩 실천하면 달성할 수 있어요",
  },
  ingredient: {
    pickerInitialCategory: "전체",
    pickerMineCategory: "나의 재료",
  },
  nutrition: {
    pageHeading: "영양 밸런스",
    cookingStyleLabel: "요리 스타일",
    macroModeLabel: "탄단지 집중",
    calorieModeLabel: "칼로리 집중",
    macroSliderSetLabel: "지정",
    macroSliderAutoLabel: "자동",
    unlimitedValue: "제한 없음",
    macroCarbs: "탄수화물",
    macroProtein: "단백질",
    macroFat: "지방",
    macroCalories: "목표 칼로리",
    styles: {
      Asian_Style: {
        label: "아시안 스타일",
        description: "한식, 중식, 일식",
      },
      Western_Style: {
        label: "양식 스타일",
        description: "이탈리안, 프렌치",
      },
      Light_Fresh: {
        label: "가볍고 신선하게",
        description: "샐러드, 건강식",
      },
    },
    guidance: {
      calories: {
        low: "⚡ 다이어트 집중 모드!",
        mid: "🍽️ 딱 좋은 한 끼",
        high: "💪 에너지 충전!",
        max: "🔥 벌크업 가즈아!",
      },
      protein: {
        low: "🥗 가벼운 단백질",
        mid: "💪 균형 잡힌 근육 케어",
        high: "🏋️ 득근 가즈아!",
      },
      carbs: {
        low: "🔥 저탄고지 모드!",
        mid: "⚖️ 균형 잡힌 에너지",
        high: "⚡ 에너지 폭발!",
      },
      fat: {
        low: "🥗 클린 식단!",
        mid: "👍 적당한 포만감",
        high: "🧈 건강한 지방 섭취",
      },
    },
  },
  fineDining: {
    pageTitle: "파인 다이닝 레시피 생성 | Recipio",
    pageDescription:
      "우리 집 식탁을 고급 레스토랑처럼. AI가 제안하는 파인 다이닝 레시피를 만나보세요.",
    ingredientSectionHeading: "재료 선택",
    ingredientSectionDescription: "사용할 재료를 선택해주세요 (최소 3개)",
    ingredientSearchPlaceholder: "재료를 검색하세요...",
    ingredientSearchAriaLabel: "재료 검색하기",
    ingredientCountSuffix: "개의 재료가 추가됨",
    selectedIngredientsHeading: "선택된 재료",
    removeAllLabel: "전체 삭제",
    tierSectionHeading: "스타일 선택",
    tierSectionDescription: "원하시는 파인다이닝 스타일을 선택해주세요",
  },
  form: {
    dishType: {
      sectionTitle: "요리 종류",
      options: [
        "🍽️ 전체",
        "🍳 볶음",
        "🍲 국/찌개/탕",
        "🥩 구이",
        "🥗 무침/샐러드",
        "🍤 튀김/부침",
        "🥘 찜/조림",
        "🍕 오븐요리",
        "🍣 생식/회",
        "🥒 절임/피클류",
        "🍝 밥/면/파스타",
        "🍰 디저트/간식류",
      ],
    },
    servings: {
      sectionTitle: "인분",
      decreaseLabel: "인분 줄이기",
      increaseLabel: "인분 늘리기",
      unit: "인분",
    },
    cookingTime: {
      sectionTitle: "조리시간",
    },
    aiCharacter: {
      withSuffix: "와 함께",
      subtitle: "맞춤형 레시피를 생성해보세요",
    },
    progressButton: {
      label: "레시피 생성하기",
    },
    usageLimitBanner: {
      message: "오늘 AI 레시피 생성 횟수를 모두 사용했어요.",
      subMessage: "내일 다시 시도해주세요!",
    },
    ingredientManager: {
      addButtonLabel: "재료 추가하기",
      addButtonAriaLabel: "재료 추가하기",
      ingredientsAddedCount: "개의 재료가 추가됨",
      addPrompt: "레시피 생성을 위해 재료를 추가해주세요",
      selectedHeading: "선택된 재료",
      removeAllLabel: "전체 삭제",
    },
  },
};
