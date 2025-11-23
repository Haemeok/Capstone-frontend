import { ArrowLeftRight } from "lucide-react";

const CookingUnitTooltip = () => {
  const unitConversions = [
    { unit: "1큰술 (1T)", value: "15ml", tip: "밥숟가락 약 2번" },
    { unit: "1작은술 (1t)", value: "5ml", tip: "티스푼 1개" },
    { unit: "1컵 (1C)", value: "200ml", tip: "종이컵 가득은 약 180ml" },
  ];

  return (
    <div className="my-4 rounded-lg border border-olive-light/30 bg-olive-light/5 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-olive-dark mb-2">
            요리 단위 변환표
          </p>
          {unitConversions.map((conversion, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">{conversion.unit}</span>
              <ArrowLeftRight size={14} className="text-olive-medium" />
              <span className="font-medium">{conversion.value}</span>
              <span className="text-gray-500">({conversion.tip})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookingUnitTooltip;
