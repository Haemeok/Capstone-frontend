import type { HomeDict } from "../../types";

export const home: HomeDict = {
  bannerError: "배너를 불러올 수 없어요",
  popularSectionTitle: "주간 인기 레시피",
  budgetSectionTitle: "만원 이하 가성비 레시피",
  youtubeBannerChip: "#유튜브 레시피",
  youtubeBannerTitle: "링크만 넣으면 레시피 완성",
  quickNav: {
    ariaLabel: "레시피 바로가기",
    trendMore: "트렌드 레시피 더보기",
    items: {
      chef: "셰프 레시피",
      youtube: "유튜브 레시피",
      quick: "초스피드",
      lateNight: "야식",
      diet: "다이어트",
      solo: "혼밥",
      kids: "아이와 함께",
      hangover: "해장",
      holiday: "기념일",
      airFryer: "에어프라이어",
    },
    compactItems: {
      chef: "셰프",
      youtube: "유튜브",
    },
  },
  meta: {
    title: "레시피오 - AI가 추천하는 홈쿡 레시피",
    description:
      "YouTube 링크 하나로 레시피 저장 · AI 맞춤 추천 · 상황별 레시피까지 한번에.",
    ogImageAlt: "레시피오 - 홈쿡 레시피",
  },
};
