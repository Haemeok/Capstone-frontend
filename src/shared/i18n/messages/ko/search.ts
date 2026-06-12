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
};

export const errors: ErrorsDict = {
  sectionGeneric: "이 영역을 불러올 수 없어요",
  video: "비디오를 불러올 수 없어요",
  comments: "댓글을 불러올 수 없어요",
  ingredients: "재료 정보를 불러올 수 없어요",
  steps: "조리 순서를 불러올 수 없어요",
  searchResults: "검색 결과를 표시할 수 없어요",
};

export const notFound: NotFoundDict = {
  message: "레시피를 찾을 수 없습니다.",
  searchCta: "레시피 찾아보기",
};
