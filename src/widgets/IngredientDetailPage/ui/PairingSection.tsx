import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { Image } from "@/shared/ui/image/Image";

import type { IngredientPairItem } from "@/entities/ingredient";

type PairingSectionProps = {
  good: IngredientPairItem[];
  bad: IngredientPairItem[];
};

type PairingChipRowProps = {
  items: IngredientPairItem[];
};

const PairingChipRow = ({ items }: PairingChipRowProps) => {
  const linkable = items.filter(
    (item): item is IngredientPairItem & { id: string; imageUrl: string } =>
      Boolean(item.id) && Boolean(item.imageUrl)
  );

  if (linkable.length === 0) return null;

  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      {linkable.map((item) => (
        <Link
          key={item.id}
          href={`/ingredients/${item.id}`}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-gray-100 py-1.5 pr-3 pl-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200"
        >
          <span className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={40}
              height={40}
              aspectRatio="1 / 1"
              fit="cover"
            />
          </span>
          <span>{item.name}</span>
          <ChevronRight size={14} className="text-gray-400" />
        </Link>
      ))}
    </div>
  );
};

const PairingSection = ({ good, bad }: PairingSectionProps) => {
  const goodLinkable = good.filter(
    (item) => Boolean(item.id) && Boolean(item.imageUrl)
  );
  const badLinkable = bad.filter(
    (item) => Boolean(item.id) && Boolean(item.imageUrl)
  );
  const hasGood = goodLinkable.length > 0;
  const hasBad = badLinkable.length > 0;

  if (!hasGood && !hasBad) return null;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="mb-3 text-lg font-bold text-gray-900">궁합 재료</h2>

      {hasGood && (
        <>
          <p className="mb-2 text-sm font-medium text-gray-600">
            같이 먹으면 좋아요
          </p>
          <PairingChipRow items={good} />
        </>
      )}

      {hasBad && (
        <>
          <p
            className={`mb-2 text-sm font-medium text-gray-600 ${
              hasGood ? "mt-4" : ""
            }`}
          >
            같이 안 먹는 걸 추천해요
          </p>
          <PairingChipRow items={bad} />
        </>
      )}
    </section>
  );
};

export default PairingSection;
