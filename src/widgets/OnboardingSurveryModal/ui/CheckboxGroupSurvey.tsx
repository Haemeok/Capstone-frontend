import { Label } from "@/shared/ui/shadcn/label";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";

import { SurveyStep } from "@/shared/config/constants/user";

type CheckboxGroupSurveyProps = {
  questionData: SurveyStep;
  values: string[];
  onValuesChange: (values: string[]) => void;
};

const CheckboxGroupSurvey = ({
  questionData,
  values,
  onValuesChange,
}: CheckboxGroupSurveyProps) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...values, optionValue]
      : values.filter((value) => value !== optionValue);
    onValuesChange(newValues);
  };

  return (
    <div className="grid gap-2">
      {questionData.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${questionData.id}-${option.value}`}
            checked={values.includes(option.value)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(option.value, checked === true)
            }
          />
          <Label
            htmlFor={`${questionData.id}-${option.value}`}
            className="text-base"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroupSurvey;
