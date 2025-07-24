import type { SurveyStep } from "@/shared/config/constants/user";

type SurveyAnswerValue = string | number | string[];

export const useSurveyValidation = () => {
  const isCurrentAnswerValid = (
    currentAnswer: SurveyAnswerValue | undefined,
    questionData: SurveyStep
  ): boolean => {
    // 선택적 질문은 항상 유효 (기본값은 true이므로 명시적으로 false인 경우만 선택적)
    if (questionData.required === false) {
      return true;
    }
    
    // 필수 질문 검증
    if (questionData.type === "checkbox") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  return {
    isCurrentAnswerValid,
  };
};