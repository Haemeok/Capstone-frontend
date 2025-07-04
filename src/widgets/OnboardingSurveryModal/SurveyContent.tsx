import { AnimatePresence,motion } from "framer-motion";

import { surveySteps } from "@/shared/config/constants/user";
import { Label } from "@/shared/ui/shadcn/label";
import { RadioGroupItem } from "@/shared/ui/shadcn/radio-group";
import { RadioGroup } from "@/shared/ui/shadcn/radio-group";

type SurveyContentProps = {
  currentStep: number;
  answers: Record<number, string>;
  handleValueChange: (value: string) => void;
};

const slideVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

const SurveyContent = ({
  currentStep,
  answers,
  handleValueChange,
}: SurveyContentProps) => {
  const currentQuestionData = surveySteps[currentStep];

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={currentStep}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        transition={{
          opacity: { type: "tween", duration: 0.05, ease: "easeOut" },
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className="grid gap-4 py-2"
      >
        {currentQuestionData && (
          <>
            <Label
              htmlFor={`question-${currentQuestionData.id}`}
              className="text-left text-lg font-bold"
            >
              {currentQuestionData.question}
            </Label>
            <RadioGroup
              id={`question-${currentQuestionData.id}`}
              value={answers[currentQuestionData.id] || ""}
              onValueChange={handleValueChange}
              className="grid gap-2"
            >
              {currentQuestionData.isRadio ? (
                currentQuestionData.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${currentQuestionData.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={`${currentQuestionData.id}-${option.value}`}
                      className="text-base"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <textarea
                    id={`question-${currentQuestionData.id}`}
                    value={answers[currentQuestionData.id] || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none"
                  />
                </div>
              )}
            </RadioGroup>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyContent;
