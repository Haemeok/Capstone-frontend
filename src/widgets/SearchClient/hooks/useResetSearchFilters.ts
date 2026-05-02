import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";

export const useResetSearchFilters = () => {
  const router = useRouter();

  return useCallback(() => {
    triggerHaptic("Light");
    router.replace("/search/results?types=USER,AI,YOUTUBE");
  }, [router]);
};
