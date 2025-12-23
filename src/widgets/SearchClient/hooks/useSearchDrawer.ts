import { useState } from "react";

import { DrawerType } from "@/shared/config/constants/recipe";

export const useFilterDrawer = () => {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null);

  const openDrawer = (type: DrawerType) => setActiveDrawer(type);
  const closeDrawer = () => setActiveDrawer(null);

  return {
    activeDrawer,
    openDrawer,
    closeDrawer,
  };
};
