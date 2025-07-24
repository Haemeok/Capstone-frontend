import type { SurveyStep } from "@/shared/config/constants/user";

type SurveyAnswerValue = string | number | string[];

export const useSurveyValidation = () => {
  const isCurrentAnswerValid = (
    currentAnswer: SurveyAnswerValue | undefined,
    questionData: SurveyStep
  ): boolean => {
    if (questionData.required === false) {
      return true;
    }

    if (questionData.type === "checkbox") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  return {
    isCurrentAnswerValid,
  };
};
