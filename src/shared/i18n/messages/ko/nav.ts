import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "홈",
  search: "검색",
  fridge: "냉장고",
  aiRecipe: "AI 레시피",
  cart: "장바구니",
  my: "My",
  recipeSearch: "레시피 검색",
  youtubeRecipe: "유튜브 레시피",
  login: "로그인",
  install: "앱 설치",
  installAria: "앱 설치하기",
  shareAria: "공유하기",
  notificationsAria: "알림 페이지로 이동",
  notificationsUnreadAria: {
    one: "알림 페이지로 이동 ({count}개 미읽음)",
    other: "알림 페이지로 이동 ({count}개 미읽음)",
  },
  unreadBadgeAria: {
    one: "{count}개의 읽지 않은 알림",
    other: "{count}개의 읽지 않은 알림",
  },
  savedBooksAria: "저장한 레시피북",
  savedBooksToast: "저장한 레시피북을 확인해보세요!",
  profile: "프로필",
  footer: {
    sectionService: "서비스",
    sectionSupport: "고객지원",
    tagline:
      "AI 기반 레시피 추천 서비스로, 냉장고 재료만으로 맛있는 요리를 만들어보세요.",
    businessInfoToggleAria: "사업자 정보 펼치기",
    terms: "서비스 이용약관",
    privacy: "개인정보 처리방침",
    reportError: "오류제보",
    adInquiry: "광고/제휴 문의",
    copyrightReport: "저작권 신고 및 게시 중단 요청",
    ceoLabel: "대표",
    csLabel: "고객센터",
    adLabel: "광고 문의",
  },
};
