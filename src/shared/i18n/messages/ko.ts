import type { Dictionary } from "../types";

export const ko: Dictionary = {
  meta: {
    search: {
      queryNoun: "레시피",
      pageSuffix: " ({page}페이지)",
      titleNoQuery: "📌 레시피 검색 결과{page} - 레시피오",
      titleWithQuery: {
        one: "📌 {q} {count}선{page} - 레시피오",
        other: "📌 {q} {count}선{page} - 레시피오",
      },
      descNoQuery:
        "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!",
      descWithQuery: {
        one: "{q} {count}개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.",
        other:
          "{q} {count}개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.",
      },
    },
  },
  errors: {
    sectionGeneric: "이 영역을 불러올 수 없어요",
    video: "비디오를 불러올 수 없어요",
    comments: "댓글을 불러올 수 없어요",
    ingredients: "재료 정보를 불러올 수 없어요",
    steps: "조리 순서를 불러올 수 없어요",
    searchResults: "검색 결과를 표시할 수 없어요",
  },
  recipeDetail: {
    ingredientsHeader: "재료",
    nutritionHeader: "영양성분",
    copyAction: "복사",
    reportAction: "제보",
    nutritionSodium: "나트륨",
    nutritionCarbs: "탄수화물",
    nutritionProtein: "단백질",
    nutritionFat: "지방",
    nutritionSugar: "당",
    servingsDecrease: "인분 줄이기",
    servingsIncrease: "인분 늘리기",
    cookingTimeLabel: "조리 시간",
    servingsLabel: "인분",
    cookingToolsLabel: "조리 도구",
    noInfo: "정보 없음",
    aiYoutubeBadge: "유튜브 영상에서 AI가 추출한 레시피예요 (Beta)",
    aiAssistedBadge: "AI의 도움을 받아 작성된 레시피예요",
    platingGuide: "플레이팅 가이드",
    subscriberLabel: "구독자",
    subscribeAction: "구독",
    pinVideo: "영상 고정",
    unpinVideo: "영상 고정 해제",
    originalVideo: "원본 영상",
    videoDisclosure:
      "이 영상은 유튜브 공식 플레이어로 재생되며, 조회수와 수익은 100% 원작자에게 돌아갑니다.",
    coupangDisclosure:
      "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.",
    commentsReadMore: "더 읽기",
    commentsWrite: "작성하기",
    recommendedTitle: "이런 레시피는 어떠신가요?",
    recommendedChefTitle: "더 다양한 셰프 레시피를 만나보세요",
    remixesTitle: "이 레시피를 변형한 리믹스",
  },
};
