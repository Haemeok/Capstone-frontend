type RecipeCookingInfoSectionProps = {
  cookingTime: number;
  cookingTools: string[];
  servings: number;
};

export default function RecipeCookingInfoSection({
  cookingTime,
  cookingTools,
  servings,
}: RecipeCookingInfoSectionProps) {
  return (
    <section className="bg-beige-light my-6 rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏱️</span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">조리 시간</span>
            <span className="text-dark font-semibold">{cookingTime}분</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">인분</span>
            <span className="text-dark font-semibold">{servings}인분</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl">🔪</span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">조리 도구</span>
            <span className="text-dark font-semibold">
              {cookingTools.length > 0 ? cookingTools.join(", ") : "정보 없음"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
