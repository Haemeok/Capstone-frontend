"use client";

import { ChefHat } from "lucide-react";

import { useUserPagesDict } from "@/shared/i18n";

export const EmptyState = () => {
  const t = useUserPagesDict();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      {/* 아이콘 원형 배경 */}
      <div className="bg-olive-light/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <ChefHat className="text-olive-light h-10 w-10" />
      </div>

      {/* 제목 */}
      <h3 className="text-ink mb-2 text-lg font-bold">
        {t.profile.emptyTitle}
      </h3>

      {/* 설명 */}
      <p className="text-ink-muted text-center text-sm leading-relaxed">
        {t.profile.emptyDescription}
      </p>
    </div>
  );
};
