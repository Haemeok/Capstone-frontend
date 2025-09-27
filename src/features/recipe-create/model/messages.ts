import {
  COOKING_TIME,
  DESCRIPTION,
  IMAGE,
  INGREDIENTS,
  SERVINGS,
  STEPS,
  TITLE,
} from "./constants";

export const MSG = {
  TITLE: {
    MIN: `제목은 ${TITLE.MIN}자 이상 입력해주세요`,
    MAX: `제목은 ${TITLE.MAX}자 이내로 입력해주세요`,
  },
  IMAGE: {
    REQUIRED: "레시피 대표 이미지를 등록해주세요",
    TYPE: "PNG/JPG/WEBP/GIF/AVIF만 업로드할 수 있어요.",
    SIZE: `${IMAGE.MAX_MB}MB 이하 이미지만 업로드할 수 있어요.`,
  },
  SERVINGS: {
    MIN: `인분은 ${SERVINGS.MIN} 이상 선택해주세요`,
  },
  COOKING_TIME: {
    MIN: `조리 시간은 ${COOKING_TIME.MIN} 이상 입력해주세요`,
  },
  DESCRIPTION: {
    MIN: `설명은 ${DESCRIPTION.MIN}자 이상 입력해주세요`,
    QUANTITY: "수량을 입력해주세요",
  },
  INGREDIENTS: {
    MIN: `최소 ${INGREDIENTS.MIN}개의 재료를 추가해주세요`,
  },
  STEPS: {
    MIN: `최소 ${STEPS.MIN}개의 조리 단계를 추가해주세요`,
    INSTRUCTION: "조리 방법을 입력해주세요",
  },
  CATEGORY: {
    REQUIRED: "카테고리를 선택해주세요",
  },
};
