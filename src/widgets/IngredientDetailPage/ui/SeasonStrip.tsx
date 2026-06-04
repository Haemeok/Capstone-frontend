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
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="mb-1 text-lg font-bold text-gray-900">제철</h2>
      <p className="mb-3 text-sm text-gray-500">가장 맛있는 시기예요</p>

      <div className="flex justify-between gap-1">
        {ALL_MONTHS.map((m) => {
          const inSeason = monthSet.has(m);
          const isCurrent = m === currentMonth;
          return (
            <div
              key={m}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
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
        <p className="text-olive-dark mt-3 flex items-center gap-1.5 text-sm font-medium">
          <Sprout size={14} />
          <span>지금이 제철!</span>
        </p>
      )}
    </section>
  );
};

export default SeasonStrip;
