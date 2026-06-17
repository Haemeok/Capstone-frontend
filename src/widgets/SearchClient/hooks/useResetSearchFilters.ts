import { useCallback } from "react";

import { useLocalizedRouter } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

export const useResetSearchFilters = () => {
  const router = useLocalizedRouter();

  return useCallback(() => {
    triggerHaptic("Light");
    router.replace("/search/results?types=USER,AI,YOUTUBE");
  }, [router]);
};
