"use client";

import { useUserStore } from "@/entities/user";
import UsageLimitBanner from "./UsageLimitBanner";

type UsageLimitSectionProps = {
  children: (props: { hasNoQuota: boolean }) => React.ReactNode;
};

const UsageLimitSection = ({ children }: UsageLimitSectionProps) => {
  const user = useUserStore((state) => state.user);
  const hasNoQuota = user?.remainingAiQuota === 0;

  return (
    <div>
      {hasNoQuota && <UsageLimitBanner />}
      {children({ hasNoQuota })}
    </div>
  );
};

export default UsageLimitSection;
