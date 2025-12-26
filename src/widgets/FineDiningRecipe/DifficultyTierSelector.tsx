import { cn } from "@/shared/lib/utils";
import {
  FINE_DINING_TIERS,
  DiningTier,
} from "@/shared/config/constants/aiModel";
import { Check } from "lucide-react";

type DifficultyTierSelectorProps = {
  selected: DiningTier | null;
  onSelect: (tier: DiningTier) => void;
};

const DifficultyTierSelector = ({
  selected,
  onSelect,
}: DifficultyTierSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">스타일 선택</h3>
        <p className="text-sm text-gray-600">
          원하시는 파인다이닝 스타일을 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {FINE_DINING_TIERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300",
              selected === option.value
                ? "border-gray-900 shadow-xl ring-gray-900/10"
                : "border-gray-200 hover:border-gray-400 hover:shadow-lg"
            )}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
              <img
                src={option.image}
                alt={option.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {selected === option.value && (
                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg">
                  <Check size={18} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex flex-col p-6 text-left">
              <h4
                className={cn(
                  "mb-2 text-xl font-bold transition-colors",
                  selected === option.value ? "text-gray-900" : "text-gray-700"
                )}
              >
                {option.label}
              </h4>
              <p className="mb-4 text-sm text-gray-500">{option.description}</p>

              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 text-gray-400">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyTierSelector;
