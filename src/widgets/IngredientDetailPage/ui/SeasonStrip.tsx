import { Sprout } from "lucide-react";

type SeasonStripProps = {
  months: number[]; // 1~12
};

const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const SeasonStrip = ({ months }: SeasonStripProps) => {
  if (months.length === 0) return null;

  const monthSet = new Set(months);
  const currentMonth = new Date().getMonth() + 1;
  const isInSeasonNow = monthSet.has(currentMonth);

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">제철</h2>
      <p className="text-sm text-gray-500 mb-3">가장 맛있는 시기예요</p>

      <div className="flex justify-between gap-1">
        {ALL_MONTHS.map((m) => {
          const inSeason = monthSet.has(m);
          const isCurrent = m === currentMonth;
          return (
            <div
              key={m}
              className={`flex-1 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                inSeason
                  ? isCurrent
                    ? "bg-olive-light text-white"
                    : "bg-olive-light/15 text-olive-dark"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {m}
            </div>
          );
        })}
      </div>

      {isInSeasonNow && (
        <p className="mt-3 text-sm font-medium text-olive-dark flex items-center gap-1.5">
          <Sprout size={14} />
          <span>지금이 제철!</span>
        </p>
      )}
    </section>
  );
};

export default SeasonStrip;
