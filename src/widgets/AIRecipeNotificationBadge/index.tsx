"use client";

import { useAIRecipeStore } from "@/features/recipe-create-ai";

type AIRecipeNotificationBadgeProps = {
  children: React.ReactNode;
};

const AIRecipeNotificationBadge = ({
  children,
}: AIRecipeNotificationBadgeProps) => {
  const { generationState } = useAIRecipeStore();

  return (
    <div className="relative">
      {children}

      {generationState === "completed" && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-olive-mint text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg animate-bounce">
            레시피 생성 완료 🎉
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-olive-mint"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeNotificationBadge;
