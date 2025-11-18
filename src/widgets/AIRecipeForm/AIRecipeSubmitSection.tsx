"use client";

import { useUserStore } from "@/entities/user";

import AIRecipeProgressButton from "./AIRecipeProgressButton";
import AIUsageLimitBanner from "./AIUsageLimitBanner";

type AIRecipeSubmitSectionProps = {
  isLoading: boolean;
  onClick?: () => void;
};

const AIRecipeSubmitSection = ({
  isLoading,
  onClick,
}: AIRecipeSubmitSectionProps) => {
  const user = useUserStore((state) => state.user);
  const hasNoQuota = user?.remainingAiQuota === 0;

  return (
    <div>
      {hasNoQuota && <AIUsageLimitBanner />}
      <AIRecipeProgressButton isLoading={isLoading} onClick={onClick} />
    </div>
  );
};

export default AIRecipeSubmitSection;
