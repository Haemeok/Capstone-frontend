"use client";

import { useT } from "@/shared/i18n";

const BudgetHeader = () => {
  const t = useT();

  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-ink text-3xl font-bold md:text-4xl">
          {t.aiRecipe.price.headerTitle}
        </h1>
      </div>
      <p className="text-ink-sub text-base md:text-lg">
        {t.aiRecipe.price.headerDescription}
      </p>
    </div>
  );
};

export default BudgetHeader;
