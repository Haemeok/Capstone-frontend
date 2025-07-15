import { SurveyStep } from "@/shared/config/constants/user";

type TextareaSurveyProps = {
  questionData: SurveyStep;
  value: string;
  onValueChange: (value: string) => void;
};

const TextareaSurvey = ({
  questionData,
  value,
  onValueChange,
}: TextareaSurveyProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <textarea
        id={`question-${questionData.id}`}
        value={value || ""}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none"
        placeholder="알레르기가 있다면 입력해주세요 (예: 견과류, 우유 등)"
        rows={3}
      />
    </div>
  );
};

export default TextareaSurvey;
