import { ComponentType } from "react";

import { SurveyStep, surveySteps } from "@/shared/config/constants/user";
import { Label } from "@/shared/ui/shadcn/label";

import CheckboxGroupSurvey from "./ui/CheckboxGroupSurvey";
import RadioGroupSurvey from "./ui/RadioGroupSurvey";
import SliderSurvey from "./ui/SliderSurvey";
import TextareaSurvey from "./ui/TextareaSurvey";

type SurveyAnswerValue = string | number | string[];

type SurveyContentProps = {
  currentStep: number;
  answers: Record<number, SurveyAnswerValue>;
  handleValueChange: (value: SurveyAnswerValue) => void;
};

const SURVEY_COMPONENT_MAP: Record<string, ComponentType<any>> = {
  radio: RadioGroupSurvey,
  checkbox: CheckboxGroupSurvey,
  textarea: TextareaSurvey,
  slider: SliderSurvey,
};

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

const SurveyContent = ({
  currentStep,
  answers,
  handleValueChange,
}: SurveyContentProps) => {
  const currentQuestionData = surveySteps[currentStep];

  const SurveyComponent =
    SURVEY_COMPONENT_MAP[currentQuestionData.type] ||
    SURVEY_COMPONENT_MAP.radio;

  const surveyProps = createSurveyProps(
    currentQuestionData,
    answers,
    handleValueChange
  );

  return (
    <div key={currentStep} className="grid gap-4 py-2">
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
    </div>
  );
};

export default SurveyContent;
