"use client";

import { getDictionary, useApiLocale } from "@/shared/i18n";

import { useAIRecipeStore } from "@/features/recipe-create-ai";

type AIRecipeNotificationBadgeProps = {
  children: React.ReactNode;
};

const AIRecipeNotificationBadge = ({
  children,
}: AIRecipeNotificationBadgeProps) => {
  const { generationState } = useAIRecipeStore();
  const t = getDictionary(useApiLocale()).appGlobal.aiJob;

  return (
    <div className="relative">
      {children}

      {generationState === "completed" && (
        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="bg-olive-light animate-bounce rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap text-white shadow-lg">
            {t.badgeComplete}
            <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
              <div className="border-t-olive-light h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeNotificationBadge;
