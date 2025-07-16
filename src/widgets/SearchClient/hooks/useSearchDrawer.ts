import { useState } from "react";

import {
  BASE_DRAWER_CONFIGS,
  DrawerType,
  TAG_EMOJI,
} from "@/shared/config/constants/recipe";

type DrawerConfig = {
  type: "dishType" | "sort" | "tags";
  header: string;
  description?: string;
  isMultiple: boolean;
  availableValues: string[];
  initialValue: string | string[];
  setValue: (value: string | string[]) => void;
};

type UseSearchDrawerProps = {
  dishType: string;
  sort: string;
  tagNames: string[];
  updateDishType: (value: string) => void;
  updateSort: (value: string) => void;
  updateTags: (value: string[]) => void;
};

export const useSearchDrawer = ({
  dishType,
  sort,
  tagNames,
  updateDishType,
  updateSort,
  updateTags,
}: UseSearchDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<DrawerConfig | null>(null);

  const dynamicStateAccessors = {
    dishType: {
      state: dishType,
      setState: updateDishType,
    },
    sort: {
      state: sort,
      setState: updateSort,
    },
    tags: {
      state: tagNames.map(
        (tag) => `${TAG_EMOJI[tag as keyof typeof TAG_EMOJI]} ${tag}`
      ),
      setState: updateTags,
    },
  };

  const openDrawer = (type: DrawerType) => {
    const baseConfig = BASE_DRAWER_CONFIGS[type];
    const dynamicState = dynamicStateAccessors[type];

    if (!baseConfig || !dynamicState) {
      console.error(`Invalid drawer type or configuration missing: ${type}`);
      return;
    }

    const finalConfig: DrawerConfig = {
      ...baseConfig,
      type,
      initialValue: dynamicState.state,
      setValue: (value: string | string[]) => {
        dynamicState.setState(value as any);
      },
    };

    setDrawerConfig(finalConfig);
    setIsDrawerOpen(true);
  };

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    drawerConfig,
    openDrawer,
  };
};
