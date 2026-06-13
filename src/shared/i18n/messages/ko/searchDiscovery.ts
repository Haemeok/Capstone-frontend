import type { SearchDiscoveryDict } from "../../types";

export const searchDiscovery: SearchDiscoveryDict = {
  searchInputAria: "레시피 검색",
  searchClearAria: "입력 지우기",
  latestRecipesTitle: "따끈따끈한 최신 레시피",
  contentSectionTitle: "이런 레시피 어때요?",
  nutritionSectionTitle: "오늘은 어떤 한 끼가 끌려요?",
  placeholders: {
    breakfast: [
      '출근 전 든든한 "계란 레시피" 검색',
      '5분 완성 "토스트 레시피" 검색',
      '속 편한 "그릭요거트 레시피" 검색',
      '해장엔 따뜻한 "북엇국 레시피" 검색',
    ],
    lunch: [
      '혼밥엔 든든 "김치찌개 레시피" 검색',
      '매콤한 불맛 "제육덮밥 레시피" 검색',
      '냉장고 털어 "비빔밥 레시피" 검색',
      '오늘은 바삭한 "돈까스 레시피" 검색',
    ],
    dinner: [
      '달콤한 양념 "불고기 레시피" 검색',
      '퇴근 후 "된장찌개 레시피" 검색',
      '불금엔 역시 "삼겹살 레시피" 검색',
      '얼큰 매콤한 "닭볶음탕 레시피" 검색',
    ],
  },
  contentPages: {
    "diet-healthy": {
      title: "🚨 입터짐 방지",
      subtitle: "살 빠지는 게 죄면 무기징역",
    },
    "ai-creative": {
      title: "🤖 AI가 만든 신박한 조합",
      subtitle: "사람은 절대 못 떠올린 레시피",
    },
    "chef-secret": {
      title: "🤫 셰프 유튜버 시크릿",
      subtitle: "구독자 100만 채널 시그니처",
    },
    "solo-drink": {
      title: "☔️ 비 오는 날 이자카야 왜 가요?",
      subtitle: "퇴근 후 10분컷 혼술 안주",
    },
    "budget-gourmet": {
      title: "💰 5천원으로 오마카세 기분",
      subtitle: "가성비 끝판왕 레시피",
    },
    "late-night-guilty": {
      title: "🌙 새벽 2시 배고프면 지는 거야",
      subtitle: "죄책감 없는 야식 레시피",
    },
    "youtube-mukbang": {
      title: "📺 먹방 유튜버가 숨긴",
      subtitle: "영상 속 그 음식 직접 만들기",
    },
    "hangover-soup": {
      title: "🍲 어젯밤 기억이 없다면",
      subtitle: "속풀이 국물 레시피 모음",
    },
    "air-fryer-legend": {
      title: "🔥 에어프라이어 레전드",
      subtitle: "유튜브 1억뷰 돌파 레시피",
    },
    "kids-snack": {
      title: "🥺 엄마 이거 또 해줘!",
      subtitle: "아이들이 직접 고른 간식",
    },
    "home-party-flex": {
      title: "🏠 손님 왔는데 요리 못한다고?",
      subtitle: "있어보이는 홈파티 메뉴",
    },
    "protein-bulk": {
      title: "💪 헬창들의 찐 식단 공개",
      subtitle: "단백질 30g 이상 벌크업",
    },
  },
  nutritionThemes: {
    KETO: { label: "키토" },
    LOW_SUGAR: { label: "저당" },
    HIGH_PROTEIN: { label: "고단백" },
    WEGOVY_FRIENDLY: { label: "위고비 친화" },
    ANTI_AGING: { label: "항노화" },
    LOW_CALORIE: { label: "저칼로리" },
    LOW_FAT: { label: "저지방" },
    LOW_SODIUM: { label: "저염식" },
    BALANCED: { label: "균형식" },
    BUDGET: { label: "저예산" },
  },
};
