import type { HomeDict } from "../../types";

export const home: HomeDict = {
  categoryTitle: "카테고리",
  bannerError: "배너를 불러올 수 없어요",
  popularSectionTitle: "주간 인기 레시피",
  budgetSectionTitle: "만원 이하 가성비 레시피",
  youtubeBannerChip: "#유튜브 레시피",
  youtubeBannerTitle: "링크만 넣으면 레시피 완성",
  desktopYoutubeImport: {
    ariaLabel: "유튜브 영상 레시피 변환",
    eyebrow: "유튜브 레시피 가져오기",
    titleLine1: "보고 있던 요리 영상,",
    titleLine2: "읽기 쉬운 레시피로 바꿔보세요",
    description:
      "영상 링크만 붙여넣으면 재료와 조리 순서를 한눈에 정리해드려요.",
    inputLabel: "유튜브 URL",
    placeholder: "유튜브 링크를 붙여넣으세요",
    submit: "레시피로 만들기",
    helper: "youtube.com과 youtu.be 링크를 지원해요.",
    invalidUrl: "올바른 유튜브 링크를 입력해주세요",
    previewAlt: "여러 요리가 담긴 유튜브 영상 예시",
    sourceTitle: "매콤 두부조림 맛있게 만드는 법",
    sourceMeta: "요리 영상 · 8분 24초",
    resultLabel: "레시피로 정리됐어요",
    resultTitle: "매콤 두부조림",
    ingredients: [
      { name: "두부", amount: "1모" },
      { name: "고춧가루", amount: "1T" },
      { name: "간장", amount: "2T" },
      { name: "대파", amount: "1/2대" },
    ],
    summary: {
      ingredientValue: "4개",
      ingredientLabel: "재료",
      stepValue: "5단계",
      stepLabel: "조리",
      timeValue: "12분",
      timeLabel: "예상",
    },
  },
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
