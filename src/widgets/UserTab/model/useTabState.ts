"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MyTabs, OtherTabs, Tab } from "@/shared/config/constants/user";
import { useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

type UseTabStateParams = {
  isOwnProfile: boolean;
  hasFirstRecord: boolean;
};

type TabWithLabel = Tab & { label: string };

type UseTabStateReturn = {
  tabs: TabWithLabel[];
  activeTab: string;
  activeTabIndex: number;
  setActiveTab: (tabId: string) => void;
};

export const useTabState = ({
  isOwnProfile,
  hasFirstRecord,
}: UseTabStateParams): UseTabStateReturn => {
  const searchParams = useSearchParams();
  const t = useUserPagesDict();
  const baseTabs = isOwnProfile ? MyTabs : OtherTabs;

  const labelFor = (id: string): string => {
    if (id === "recipes")
      return isOwnProfile
        ? t.profile.tabs.recipes
        : t.profile.tabs.recipesOther;
    if (id === "saved") return t.profile.tabs.saved;
    return t.profile.tabs.calendar;
  };

  const tabs = useMemo(
    () => baseTabs.map((tab) => ({ ...tab, label: labelFor(tab.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseTabs, t]
  );

  const getInitialTab = () => {
    const param = searchParams.get("tab");
    if (param && baseTabs.some((tab) => tab.id === param)) return param;
    if (isOwnProfile && !hasFirstRecord) return "calendar";
    return "recipes";
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const tabParam = searchParams.get("tab");
  const [syncedFrom, setSyncedFrom] = useState({ tabParam, baseTabs });

  if (syncedFrom.tabParam !== tabParam || syncedFrom.baseTabs !== baseTabs) {
    setSyncedFrom({ tabParam, baseTabs });
    if (
      tabParam &&
      baseTabs.some((tab) => tab.id === tabParam) &&
      tabParam !== activeTab
    ) {
      setActiveTabState(tabParam);
    }
  }

  const activeTabIndex = useMemo(
    () => baseTabs.findIndex((tab) => tab.id === activeTab),
    [baseTabs, activeTab]
  );

  const setActiveTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      triggerHaptic("Light");
      setActiveTabState(tabId);

      const params = new URLSearchParams(window.location.search);
      params.set("tab", tabId);
      window.history.replaceState(null, "", `?${params.toString()}`);
    },
    [activeTab]
  );

  return { tabs, activeTab, activeTabIndex, setActiveTab };
};
