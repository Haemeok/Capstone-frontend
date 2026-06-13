import {
  DiningTier,
  FINE_DINING_TIERS,
} from "@/shared/config/constants/aiModel";
import { useT } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { CheckIcon } from "@/shared/ui/icons";

type DifficultyTierSelectorProps = {
  selected: DiningTier | null;
  onSelect: (tier: DiningTier) => void;
};

const DifficultyTierSelector = ({
  selected,
  onSelect,
}: DifficultyTierSelectorProps) => {
  const t = useT();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-ink mb-2 text-2xl font-bold">
          {t.aiRecipe.fineDining.tierSectionHeading}
        </h3>
        <p className="text-ink-sub text-sm">
          {t.aiRecipe.fineDining.tierSectionDescription}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {FINE_DINING_TIERS.map((option) => {
          const tierDict = t.aiRecipe.diningTiers[option.value];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={cn(
                "group rounded-card relative flex flex-col overflow-hidden border-2 transition-all duration-300",
                selected === option.value
                  ? "border-gray-900 shadow-xl ring-gray-900/10"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-lg"
              )}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <img
                  src={option.image}
                  alt={tierDict.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {selected === option.value && (
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg">
                    <CheckIcon size={18} />
                  </div>
                )}
              </div>

              <div className="flex flex-col p-4 text-left md:p-6">
                <h4
                  className={cn(
                    "mb-2 text-lg font-bold transition-colors md:text-xl",
                    selected === option.value ? "text-ink" : "text-ink-sub"
                  )}
                >
                  {tierDict.label}
                </h4>
                <p className="text-ink-muted mb-3 text-xs md:mb-4 md:text-sm">
                  {tierDict.description}
                </p>

                <div className="space-y-1.5 md:space-y-2">
                  {tierDict.features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-ink-sub flex items-start gap-2 text-xs md:text-sm"
                    >
                      <span className="mt-0.5 text-gray-400">•</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyTierSelector;
