import type { PairingIngredient } from "@/entities/ingredient";

import PairingChip from "./PairingChip";

type PairingSectionProps = {
  good: PairingIngredient[];
  bad: PairingIngredient[];
};

const ChipRow = ({ items }: { items: PairingIngredient[] }) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 px-1">해당 재료 없음</p>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
      {items.map((item) => (
        <PairingChip key={item.id} ingredient={item} />
      ))}
    </div>
  );
};

const PairingSection = ({ good, bad }: PairingSectionProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">궁합 재료</h2>

      <p className="text-sm font-medium text-gray-600 mb-2">같이 먹으면 좋아요</p>
      <ChipRow items={good} />

      <p className="text-sm font-medium text-gray-600 mb-2 mt-4">피해야 해요</p>
      <ChipRow items={bad} />
    </section>
  );
};

export default PairingSection;
