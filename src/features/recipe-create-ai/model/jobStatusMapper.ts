import type { AIJobStatusResponse } from "./types";

export type AIJobStateUpdate =
  | { state: "completed"; resultRecipeId: string }
  | { state: "failed"; code: string | undefined; message: string }
  | { state: "polling"; progress: number };

const DEFAULT_FAILURE_MESSAGE = "AI 레시피 생성에 실패했습니다.";

export const fromAIJobStatusResponse = (
  raw: AIJobStatusResponse
): AIJobStateUpdate => {
  if (raw.resultRecipeId) {
    return { state: "completed", resultRecipeId: raw.resultRecipeId };
  }

  switch (raw.status) {
    case "FAILED":
      return {
        state: "failed",
        code: raw.code,
        // 빈 문자열 메시지도 무용하므로 기본 문구로 대체 (|| 의도)
        message: raw.message || DEFAULT_FAILURE_MESSAGE,
      };

    case "COMPLETED":
    case "PENDING":
    case "IN_PROGRESS":
      return { state: "polling", progress: raw.progress ?? 0 };
  }
};
