import { SurveyStep } from "@/shared/config/constants/user";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { Label } from "@/shared/ui/shadcn/label";

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
  const handleCheckboxChange = (optionLabel: string, checked: boolean) => {
    const newValues = checked
      ? [...values, optionLabel]
      : values.filter((value) => value !== optionLabel);
    onValuesChange(newValues);
  };

  return (
    <div className="grid gap-2">
      {questionData.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${questionData.id}-${option.value}`}
            checked={values.includes(option.label)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(option.label, checked === true)
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
