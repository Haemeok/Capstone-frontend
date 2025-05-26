import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';

import { surveySteps } from '@/constants/user';
import { motion, AnimatePresence } from 'framer-motion';

type SurveyContentProps = {
  currentStep: number;
  answers: Record<number, string>;
  handleRadioChange: (value: string) => void;
};

const slideVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

const SurveyContent = ({
  currentStep,
  answers,
  handleRadioChange,
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
          opacity: { type: 'tween', duration: 0.05, ease: 'easeOut' },
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
              value={answers[currentQuestionData.id] || ''}
              onValueChange={handleRadioChange}
              className="grid gap-2"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${currentQuestionData.id}-${option.value}`}
                  />
                  <Label htmlFor={`${currentQuestionData.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyContent;
