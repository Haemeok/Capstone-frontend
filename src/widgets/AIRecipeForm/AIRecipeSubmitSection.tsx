"use client";

import { useUserStore } from "@/entities/user";

import AIRecipeProgressButton from "./AIRecipeProgressButton";
import UsageLimitBanner from "./UsageLimitBanner";

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
      {hasNoQuota && <UsageLimitBanner />}
      <AIRecipeProgressButton isLoading={isLoading} onClick={onClick} />
    </div>
  );
};

export default AIRecipeSubmitSection;
