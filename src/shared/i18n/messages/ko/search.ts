import type {
  ErrorsDict,
  MetaDict,
  NotFoundDict,
  SearchDict,
} from "../../types";

export const search: SearchDict = {
  lastPage: "모든 레시피를 불러왔습니다.",
  noResults: "표시할 레시피가 없습니다.",
};

export const meta: MetaDict = {
  search: {
    queryNoun: "레시피",
    pageSuffix: " ({page}페이지)",
    titleNoQuery: "📌 레시피 검색 결과{page} - 레시피오",
    titleWithQuery: "📌 {q} 검색 결과{page} - 레시피오",
    descNoQuery:
      "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!",
    descWithQuery:
      "{q}를 한눈에 비교해 보세요. 재료비부터 영양성분까지 다 나옵니다.",
  },
};

export const errors: ErrorsDict = {
  sectionGeneric: "이 영역을 불러올 수 없어요",
  video: "비디오를 불러올 수 없어요",
  comments: "댓글을 불러올 수 없어요",
  ingredients: "재료 정보를 불러올 수 없어요",
  steps: "조리 순서를 불러올 수 없어요",
  searchResults: "검색 결과를 표시할 수 없어요",
  heading: "문제가 발생했어요",
  retry: "다시 시도",
  goHome: "홈으로 가기",
  goBack: "뒤로 가기",
  sectionMessage: "이 영역을 불러올 수 없어요",
  sectionRetry: "재시도",
  context: {
    recipe: "레시피를 불러올 수 없어요",
    search: "검색 결과를 불러올 수 없어요",
    ingredients: "재료 정보를 불러올 수 없어요",
    edit: "레시피 수정 페이지를 불러올 수 없어요",
    calendar: "캘린더를 불러올 수 없어요",
    generic: "잠시 후 다시 시도해주세요",
  },
};

export const notFound: NotFoundDict = {
  message: "레시피를 찾을 수 없습니다.",
  searchCta: "레시피 찾아보기",
  goBack: "뒤로 가기",
  goHome: "홈으로 가기",
  recipe: {
    title: "존재하지 않는 레시피입니다",
    description:
      "레시피가 삭제되었거나 존재하지 않습니다. 다른 레시피를 찾아보시겠어요?",
  },
  generic: {
    title: "페이지를 찾을 수 없어요",
    description: "요청하신 페이지가 존재하지 않습니다.",
  },
};
