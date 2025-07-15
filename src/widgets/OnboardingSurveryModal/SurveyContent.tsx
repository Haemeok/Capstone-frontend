import { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { surveySteps, SurveyStep } from "@/shared/config/constants/user";
import { Label } from "@/shared/ui/shadcn/label";

import RadioGroupSurvey from "./ui/RadioGroupSurvey";
import CheckboxGroupSurvey from "./ui/CheckboxGroupSurvey";
import TextareaSurvey from "./ui/TextareaSurvey";

type SurveyAnswerValue = string | number | string[];

type SurveyContentProps = {
  currentStep: number;
  answers: Record<number, SurveyAnswerValue>;
  handleValueChange: (value: SurveyAnswerValue) => void;
};

// 컴포넌트 맵핑 - 새로운 타입 추가 시 여기만 수정
const SURVEY_COMPONENT_MAP: Record<string, ComponentType<any>> = {
  radio: RadioGroupSurvey,
  checkbox: CheckboxGroupSurvey,
  textarea: TextareaSurvey,
};

// Props 생성자 맵핑 - 각 타입별 Props 생성 로직 분리
const SURVEY_PROPS_CREATORS = {
  checkbox: (
    questionData: SurveyStep,
    answers: Record<number, SurveyAnswerValue>,
    handleValueChange: (value: SurveyAnswerValue) => void
  ) => ({
    questionData,
    values: (answers[questionData.id] as string[]) || [],
    onValuesChange: handleValueChange,
  }),

  default: (
    questionData: SurveyStep,
    answers: Record<number, SurveyAnswerValue>,
    handleValueChange: (value: SurveyAnswerValue) => void
  ) => ({
    questionData,
    value: (answers[questionData.id] as string) || "",
    onValueChange: handleValueChange,
  }),
};

// Props 생성 함수 - switch case 제거
const createSurveyProps = (
  questionData: SurveyStep,
  answers: Record<number, SurveyAnswerValue>,
  handleValueChange: (value: SurveyAnswerValue) => void
) => {
  const propsCreator =
    SURVEY_PROPS_CREATORS[
      questionData.type as keyof typeof SURVEY_PROPS_CREATORS
    ] || SURVEY_PROPS_CREATORS.default;

  return propsCreator(questionData, answers, handleValueChange);
};

const slideVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, x: 0 },
};

const SurveyContent = ({
  currentStep,
  answers,
  handleValueChange,
}: SurveyContentProps) => {
  const currentQuestionData = surveySteps[currentStep];

  // 동적 컴포넌트 선택
  const SurveyComponent =
    SURVEY_COMPONENT_MAP[currentQuestionData.type] ||
    SURVEY_COMPONENT_MAP.radio; // fallback

  // Props 생성
  const surveyProps = createSurveyProps(
    currentQuestionData,
    answers,
    handleValueChange
  );

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
            <SurveyComponent {...surveyProps} />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyContent;
