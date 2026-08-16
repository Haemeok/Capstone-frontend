"use client";

import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  INGREDIENT_PACKS,
  type IngredientPack,
} from "@/shared/config/constants/ingredientPacks";
import { useIngredientAddDict } from "@/shared/i18n";

import { IngredientPackCard } from "./IngredientPackCard";

type RecommendedPacksSectionProps = {
  ownedIngredientIds: Set<string>;
  isDisabled: boolean;
  isOwnershipPending: boolean;
  hasOwnershipError: boolean;
  onViewPack: (pack: IngredientPack) => void;
};

export const RecommendedPacksSection = ({
  ownedIngredientIds,
  isDisabled,
  isOwnershipPending,
  hasOwnershipError,
  onViewPack,
}: RecommendedPacksSectionProps) => {
  const dict = useIngredientAddDict();
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="ingredient-packs-heading"
      aria-busy={isOwnershipPending}
      className="px-4 pt-5 pb-2 md:px-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="ingredient-packs-heading"
            className="text-ink text-base font-bold"
          >
            {dict.packsHeading}
          </h2>
          <p className="text-ink-muted mt-1 text-sm">{dict.packsSubtitle}</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label={dict.previousPacks}
            onClick={() => scrollRail(-1)}
            className="text-ink-sub focus-visible:outline-ink hidden h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 md:flex"
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button
            type="button"
            aria-label={dict.nextPacks}
            onClick={() => scrollRail(1)}
            className="text-ink-sub focus-visible:outline-ink hidden h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 md:flex"
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
      {isOwnershipPending ? (
        <p role="status" className="sr-only">
          {dict.packsOwnershipLoading}
        </p>
      ) : null}
      {hasOwnershipError ? (
        <p
          role="alert"
          className="text-ink-sub mt-3 bg-gray-100 px-3 py-2 text-sm"
        >
          {dict.packsOwnershipUnavailable}
        </p>
      ) : null}
      <div
        ref={railRef}
        role="group"
        aria-label={dict.packsHeading}
        className="scrollbar-hide -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6"
      >
        {INGREDIENT_PACKS.map((pack) => (
          <IngredientPackCard
            key={pack.name}
            pack={pack}
            ownedIngredientIds={ownedIngredientIds}
            isDisabled={isDisabled}
            onViewDetail={onViewPack}
          />
        ))}
      </div>
    </section>
  );
};
