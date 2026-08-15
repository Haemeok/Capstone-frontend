"use client";

import { useIsApp } from "@/shared/hooks/useIsApp";
import { StoreBadges } from "@/shared/ui/StoreBadges";

type AppInstallActionsProps = {
  className?: string;
};

export const AppInstallActions = ({ className }: AppInstallActionsProps) => {
  const isInApp = useIsApp();

  if (isInApp) {
    return (
      <p className={`text-ink-sub text-base ${className ?? ""}`}>
        현재 앱을 이용 중이에요
      </p>
    );
  }

  return <StoreBadges className={className} />;
};
