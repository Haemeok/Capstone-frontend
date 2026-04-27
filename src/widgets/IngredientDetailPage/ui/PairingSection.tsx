type PairingSectionProps = {
  good: string[];
  bad: string[];
};

const PairingChipRow = ({ items }: { items: string[] }) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
    {items.map((name) => (
      <span
        key={name}
        className="inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
      >
        {name}
      </span>
    ))}
  </div>
);

const PairingSection = ({ good, bad }: PairingSectionProps) => {
  const hasGood = good.length > 0;
  const hasBad = bad.length > 0;

  if (!hasGood && !hasBad) {
    return null;
  }

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">궁합 재료</h2>

      {hasGood && (
        <>
          <p className="text-sm font-medium text-gray-600 mb-2">
            같이 먹으면 좋아요
          </p>
          <PairingChipRow items={good} />
        </>
      )}

      {hasBad && (
        <>
          <p
            className={`text-sm font-medium text-gray-600 mb-2 ${
              hasGood ? "mt-4" : ""
            }`}
          >
            피해야 해요
          </p>
          <PairingChipRow items={bad} />
        </>
      )}
    </section>
  );
};

export default PairingSection;
