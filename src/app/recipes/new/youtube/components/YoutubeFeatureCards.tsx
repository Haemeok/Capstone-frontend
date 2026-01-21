import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";

const FEATURE_ITEMS = [
  { icon: "nutrition_info.webp", label: "영양성분·칼로리" },
  { icon: "cost_analysis.webp", label: "예상 원가 분석" },
  { icon: "timer_tool.webp", label: "조리 타이머" },
  { icon: "portion_calculator.webp", label: "인분수 변환" },
] as const;

export const YoutubeFeatureCards = () => {
  return (
    <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
      {FEATURE_ITEMS.map((item) => (
        <div
          key={item.icon}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-3 text-center"
        >
          <Image
            src={`${ICON_BASE_URL}${item.icon}`}
            alt={item.label}
            wrapperClassName="w-16 h-16"
            lazy={false}
          />
          <span className="text-sm font-semibold text-gray-600">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
