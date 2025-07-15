import { Label } from "@/shared/ui/shadcn/label";
import { RadioGroupItem, RadioGroup } from "@/shared/ui/shadcn/radio-group";

import { SurveyStep } from "@/shared/config/constants/user";

type RadioGroupSurveyProps = {
  questionData: SurveyStep;
  value: string;
  onValueChange: (value: string) => void;
};

const RadioGroupSurvey = ({
  questionData,
  value,
  onValueChange,
}: RadioGroupSurveyProps) => {
  return (
    <RadioGroup
      id={`question-${questionData.id}`}
      value={value || ""}
      onValueChange={onValueChange}
      className="grid gap-2"
    >
      {questionData.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`${questionData.id}-${option.value}`}
          />
          <Label
            htmlFor={`${questionData.id}-${option.value}`}
            className="text-base"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioGroupSurvey;
