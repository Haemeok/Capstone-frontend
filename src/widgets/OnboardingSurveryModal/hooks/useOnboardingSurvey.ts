import { useEffect, useState } from "react";

import { surveySteps } from "@/shared/config/constants/user";

import { useUserStore } from "@/entities/user";

import { SurveyAnswers, useSurveyMutation } from "@/features/user-survey";

type SurveyAnswerValue = string | number | string[];

export const useOnboardingSurvey = () => {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyAnswerValue>>({});

  const surveyMutation = useSurveyMutation({
    onSuccess: () => {
      setIsOpen(false);
      setAnswers({});
      setCurrentStep(0);
    },
  });

  useEffect(() => {
    const shouldShow = user && !user.surveyCompleted;
    setIsOpen(shouldShow || false);
  }, [user]);

  const handleValueChange = (value: SurveyAnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [surveySteps[currentStep].id]: value,
    }));
  };

  const transformAnswersToApiFormat = (): SurveyAnswers => {
    return {
      spicyLevel: Number(answers[1]) || 1,
      allergy: (answers[2] as string) || "",
      tags: (answers[3] as string[]) || [],
    };
  };

  const handleNext = () => {
    const totalSteps = surveySteps.length;

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const apiData = transformAnswersToApiFormat();
      surveyMutation.mutate(apiData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const shouldShowSurvey = user && !user.surveyCompleted;

  return {
    isOpen,
    currentStep,
    answers,
    user,
    shouldShowSurvey,

    currentQuestionData: surveySteps[currentStep],
    totalSteps: surveySteps.length,

    handleValueChange,
    handleNext,
    handlePrevious,
    handleClose,

    isSubmitting: surveyMutation.isPending,
  };
};
