import { ApiError } from "@/shared/api/client";
import { getErrorData } from "@/shared/api/errors";

export const RECIPE_BOOK_ERROR_MESSAGES: Record<number, string> = {
  1101: "요청한 폴더가 없어요.",
  1102: "이 폴더에 접근할 수 없어요.",
  1103: "기본 폴더는 삭제할 수 없어요.",
  1104: "기본 폴더는 이름을 변경할 수 없어요.",
  1105: "이미 폴더에 들어있는 레시피예요.",
  1106: "폴더는 최대 20개까지 만들 수 있어요.",
  1107: "이미 같은 이름의 폴더가 있어요.",
};

export const FALLBACK_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

export const getRecipeBookErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    const data = getErrorData(error);
    const code = data?.code;
    if (typeof code === "number" && RECIPE_BOOK_ERROR_MESSAGES[code]) {
      return RECIPE_BOOK_ERROR_MESSAGES[code];
    }
  }
  return FALLBACK_ERROR_MESSAGE;
};
