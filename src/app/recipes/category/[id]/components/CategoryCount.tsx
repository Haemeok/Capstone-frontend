"use client";

import { useCategoryDict } from "@/shared/i18n/useCategoryDict";

type CategoryCountProps = {
  total: number | undefined;
};

const CategoryCount = ({ total }: CategoryCountProps) => {
  const dict = useCategoryDict();
  if (total == null) return null;
  return (
    <span className="text-ink-muted text-sm">
      {dict.countAll} {total}
    </span>
  );
};

export default CategoryCount;
