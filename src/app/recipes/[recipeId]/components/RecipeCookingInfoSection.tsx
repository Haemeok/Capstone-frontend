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
    <section className="mb-2 rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-2xl">⏱️</span>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-gray-500">조리 시간</span>
            <span className="text-dark font-semibold">{cookingTime}분</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="shrink-0 text-2xl">👥</span>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-gray-500">인분</span>
            <span className="text-dark font-semibold">{servings}인분</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="shrink-0 text-2xl">🔪</span>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-gray-500">조리 도구</span>
            <span className="text-dark font-semibold break-words whitespace-normal">
              {cookingTools.length > 0 ? cookingTools.join(", ") : "정보 없음"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
