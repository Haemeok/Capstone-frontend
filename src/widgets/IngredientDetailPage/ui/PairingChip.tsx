"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { PairingIngredient } from "@/entities/ingredient";

type PairingChipProps = {
  ingredient: PairingIngredient;
};

const PairingChip = ({ ingredient }: PairingChipProps) => {
  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0 hover:bg-gray-50 active:scale-[0.98] transition-all"
    >
      <span>{ingredient.name}</span>
      <ChevronRight size={14} className="text-gray-400" />
    </Link>
  );
};

export default PairingChip;
