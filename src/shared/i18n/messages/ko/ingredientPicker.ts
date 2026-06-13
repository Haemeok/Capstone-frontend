import type { IngredientPickerDict } from "../../types";

export const ingredientPicker: IngredientPickerDict = {
  title: "재료 추가",
  closeAria: "닫기",
  searchAria: "검색",
  searchAction: "검색",
  searchPlaceholder: "재료를 검색해서 추가하세요",
  loading: "재료 로딩 중...",
  errorPrefix: "오류 발생: {message}",
  unknownError: "알 수 없는 오류",
  allLoaded: "모든 재료를 불러왔습니다.",
  noResults: "“{query}”에 해당하는 재료가 없습니다.",
  myIngredients: "나의 재료",
  cardSelect: "{name} 선택",
  cardDeselect: "{name} 선택 해제",
  complete: "완료",
  removeAria: "{name} 제거",
};
