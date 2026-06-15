"use client";

import { Refrigerator } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { Button } from "@/shared/ui/shadcn/button";

const IngredientEmptyState = () => {
  const t = useIngredientsDict().empty;
  return (
    <div className="col-span-2 flex min-h-[300px] flex-col items-center justify-center gap-5 px-6 py-8">
      <Refrigerator
        className="h-16 w-16 text-gray-300"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="space-y-2 text-center">
        <h3 className="text-ink text-lg font-bold">{t.heading}</h3>
        <p className="text-ink-muted text-sm">
          {t.bodyLine1}
          <br />
          {t.bodyLine2}
        </p>
      </div>
      <LocalizedLink href="/ingredients/new">
        <Button className="bg-olive-light active:bg-olive-light/90 h-12 cursor-pointer rounded-xl px-6 font-medium text-white transition-colors">
          {t.cta}
        </Button>
      </LocalizedLink>
    </div>
  );
};

export default IngredientEmptyState;
