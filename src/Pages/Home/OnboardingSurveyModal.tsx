import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { surveySteps } from '@/constants/user';
import SurveyContent from './SurveyContent';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

type OnboardingSurveyModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSurveyComplete: (answers: Record<number, string>) => void;
};

export const OnboardingSurveyModal = ({
  isOpen,
  onOpenChange,
  onSurveyComplete,
}: OnboardingSurveyModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { user } = useUserStore();

  const handleRadioChange = (value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [surveySteps[currentStep].id]: value,
    }));
  };

  const totalSteps = surveySteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSurveyComplete(answers);
      onOpenChange(false);
      setAnswers({});
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestionData = surveySteps[currentStep];

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
                  'h-1 grow rounded-full transition-all duration-300',
                  index <= currentStep ? 'bg-olive-mint' : 'bg-gray-200',
                )}
              />
            ))}
          </div>
        </DialogHeader>
        <SurveyContent
          currentStep={currentStep}
          answers={answers}
          handleRadioChange={handleRadioChange}
        />
        <DialogFooter>
          <button
            className={cn(currentStep > 0 ? 'opacity-100' : 'opacity-0')}
            onClick={handlePrevious}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className={cn(
              'rounded-2xl px-4 py-2 text-white transition-all duration-300',
              !answers[currentQuestionData?.id]
                ? 'bg-olive-mint/50'
                : 'bg-olive-mint',
            )}
            disabled={!answers[currentQuestionData?.id]}
          >
            {currentStep === totalSteps - 1 ? '완료' : '다음'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
