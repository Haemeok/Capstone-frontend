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
      <h2 className="text-lg font-bold text-gray-800 mb-3">제철</h2>

      <div className="flex justify-between gap-1">
        {ALL_MONTHS.map((m) => {
          const inSeason = monthSet.has(m);
          const isCurrent = m === currentMonth;
          return (
            <div
              key={m}
              className={`flex-1 h-9 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                inSeason
                  ? isCurrent
                    ? "bg-olive-light text-white"
                    : "bg-olive-light/20 text-olive-dark"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {m}
            </div>
          );
        })}
      </div>

      {isInSeasonNow && (
        <p className="mt-3 text-sm font-medium text-olive-dark">
          🌿 지금이 제철!
        </p>
      )}
    </section>
  );
};

export default SeasonStrip;
