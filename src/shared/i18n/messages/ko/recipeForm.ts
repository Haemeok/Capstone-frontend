import type { RecipeFormDict } from "../../types";

export const recipeForm: RecipeFormDict = {
  labels: {
    title: "레시피 제목",
    image: "대표 이미지",
    ingredients: "재료",
    cookingTime: "조리시간",
    servings: "인분",
    dishType: "카테고리",
    description: "레시피 설명",
    steps: "조리 과정",
    cookingTools: "조리 도구",
    tags: "태그",
  },
  validation: {
    titleMin: "제목은 {min}자 이상 입력해주세요",
    titleMax: "제목은 {max}자 이내로 입력해주세요",
    imageRequired: "레시피 대표 이미지를 등록해주세요",
    imageType: "PNG/JPG/WEBP/GIF/AVIF만 업로드할 수 있어요.",
    imageSize: "{max}MB 이하 이미지만 업로드할 수 있어요.",
    servingsMin: "인분은 {min} 이상 선택해주세요",
    cookingTimeMin: "조리 시간은 {min} 이상 입력해주세요",
    descriptionMin: "설명은 {min}자 이상 입력해주세요",
    quantityRequired: "수량을 입력해주세요",
    unitRequired: "단위를 선택해주세요",
    ingredientsMin: "최소 {min}개의 재료를 추가해주세요",
    stepsMin: "최소 {min}개의 조리 단계를 추가해주세요",
    instructionRequired: "조리 방법을 입력해주세요",
    categoryRequired: "카테고리를 선택해주세요",
  },
};
