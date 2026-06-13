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
};
