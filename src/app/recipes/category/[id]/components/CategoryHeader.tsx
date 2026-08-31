"use client";

import { useCategoryDict } from "@/shared/i18n/useCategoryDict";
import PrevButton from "@/shared/ui/PrevButton";

const CategoryHeader = () => {
  const dict = useCategoryDict();

  return (
    <header className="relative flex h-[52px] items-center border-b border-gray-100 px-2">
      <PrevButton className="h-11 w-11 cursor-pointer" showOnDesktop />
      <h1 className="text-ink absolute inset-x-14 text-center text-base font-bold">
        {dict.pageTitle}
      </h1>
    </header>
  );
};

export default CategoryHeader;
