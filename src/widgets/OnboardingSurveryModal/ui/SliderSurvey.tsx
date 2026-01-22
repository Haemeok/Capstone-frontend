import { useRef } from "react";

import { SurveyStep } from "@/shared/config/constants/user";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Slider } from "@/shared/ui/shadcn/slider";

type SliderSurveyProps = {
  questionData: SurveyStep;
  value: string | number;
  onValueChange: (value: string) => void;
};

const SliderSurvey = ({
  questionData,
  value,
  onValueChange,
}: SliderSurveyProps) => {
  const numericValue = typeof value === "string" ? parseInt(value) || 1 : value;
  const lastStepRef = useRef<number | null>(null);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];

    if (lastStepRef.current !== null && newValue !== lastStepRef.current) {
      triggerHaptic("Light");
    }
    lastStepRef.current = newValue;

    onValueChange(newValue.toString());
  };

  const spiceLabels = [
    {
      level: 1,
      text: "아예 안 매운맛",
      emoji: "😌",
      color: "bg-red-50 text-red-400",
    },
    {
      level: 2,
      text: "별로 안 매운맛",
      emoji: "🙂",
      color: "bg-red-100 text-red-500",
    },
    {
      level: 3,
      text: "보통",
      emoji: "😐",
      color: "bg-red-200 text-red-600",
    },
    {
      level: 4,
      text: "매운맛",
      emoji: "😰",
      color: "bg-red-300 text-red-700",
    },
    {
      level: 5,
      text: "완전 매운맛",
      emoji: "🥵",
      color: "bg-red-500 text-white",
    },
  ];

  const currentSpice = spiceLabels[numericValue - 1];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={`inline-flex items-center gap-3 rounded-full px-6 py-3 ${currentSpice?.color} transition-all duration-300`}
        >
          <span className="text-2xl">{currentSpice?.emoji}</span>
          <div className="text-left">
            <div className="text-lg font-bold">{numericValue}단계</div>
            <div className="text-sm">{currentSpice?.text}</div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Slider
          id={`question-${questionData.id}`}
          min={questionData.min || 1}
          max={questionData.max || 5}
          step={1}
          value={[numericValue]}
          onValueChange={handleSliderChange}
          className="[&>*[data-slot=slider-range]]:bg-olive-mint w-full [&>*[data-slot=slider-thumb]]:transition-all [&>*[data-slot=slider-thumb]]:duration-300 [&>*[data-slot=slider-thumb]]:ease-in-out [&>*[data-slot=slider-track]]:bg-gray-200"
        />
      </div>

      <div className="-mt-2 flex justify-between px-4">
        {spiceLabels.map((spice) => (
          <div
            key={spice.level}
            className={`flex flex-col items-center transition-all duration-200 ${
              numericValue === spice.level
                ? "scale-110 opacity-100"
                : "opacity-50 hover:opacity-75"
            }`}
          >
            <span className="mb-1 text-lg">{spice.emoji}</span>
            <span className="text-center text-xs font-medium">
              {spice.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderSurvey;
