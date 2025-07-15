"use client";

import React, { useState } from "react";

import { surveySteps } from "@/shared/config/constants/user";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import { useUserStore } from "@/entities/user";

import { SurveyAnswers,useSurveyMutation } from "@/features/user-survey";

import SurveyContent from "./SurveyContent";

type SurveyAnswerValue = string | number | string[];

type OnboardingSurveyModalProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSurveyComplete?: (answers: Record<number, SurveyAnswerValue>) => void;
};

export const OnboardingSurveyModal = ({
  isOpen: propIsOpen,
  onOpenChange: propOnOpenChange,
  onSurveyComplete: propOnSurveyComplete,
}: OnboardingSurveyModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);

  // 내부 상태 또는 prop 상태 사용
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const onOpenChange = propOnOpenChange || setInternalIsOpen;
  const onSurveyComplete = propOnSurveyComplete || (() => {});
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyAnswerValue>>({});
  const { user } = useUserStore();
  const surveyMutation = useSurveyMutation({
    onSuccess: () => {
      onSurveyComplete(answers);
      onOpenChange(false);
      setAnswers({});
      setCurrentStep(0);
    },
  });

  const handleValueChange = (value: SurveyAnswerValue) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [surveySteps[currentStep].id]: value,
    }));
  };

  const totalSteps = surveySteps.length;

  const transformAnswersToApiFormat = (): SurveyAnswers => {
    return {
      spicyLevel: Number(answers[1]) || 1,
      allergy: (answers[2] as string) || "",
      tags: (answers[3] as string[]) || [],
    };
  };

  const handleNext = () => {
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

  const currentQuestionData = surveySteps[currentStep];

  const isCurrentAnswerValid = () => {
    const currentAnswer = answers[currentQuestionData.id];
    if (currentQuestionData.type === "checkbox") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            {user?.nickname}님, 어떤 맛을 좋아하세요?
            <br />
            함께 맛있는 이야기 만들어가요!
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            자주 사용하는 재료나, 입맛을 알려주세요.
            <br />
            저희가 기억하고 딱 맞는 레시피만 골라드릴게요.
          </DialogDescription>
          <div className="mt-2 flex gap-3 rounded-full bg-white">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 grow rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-olive-mint" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </DialogHeader>
        <SurveyContent
          currentStep={currentStep}
          answers={answers}
          handleValueChange={handleValueChange}
        />
        <DialogFooter>
          <button
            className={cn(
              currentStep > 0 ? "opacity-100" : "opacity-0",
              "rounded-2xl border-1 border-gray-300 px-4 py-2 transition-all duration-300"
            )}
            onClick={handlePrevious}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!isCurrentAnswerValid() || surveyMutation.isPending}
            className={cn(
              "rounded-2xl px-4 py-2 text-white transition-all duration-300",
              !isCurrentAnswerValid() || surveyMutation.isPending
                ? "bg-olive-mint/50 cursor-not-allowed"
                : "bg-olive-mint"
            )}
          >
            {surveyMutation.isPending
              ? "제출 중..."
              : currentStep === totalSteps - 1
                ? "완료"
                : "다음"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
