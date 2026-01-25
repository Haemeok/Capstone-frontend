"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { MyTabs, OtherTabs, Tab } from "@/shared/config/constants/user";
import { triggerHaptic } from "@/shared/lib/bridge";

type UseTabStateParams = {
  isOwnProfile: boolean;
  hasFirstRecord: boolean;
};

type UseTabStateReturn = {
  tabs: Tab[];
  activeTab: string;
  activeTabIndex: number;
  setActiveTab: (tabId: string) => void;
};

export const useTabState = ({
  isOwnProfile,
  hasFirstRecord,
}: UseTabStateParams): UseTabStateReturn => {
  const searchParams = useSearchParams();
  const tabs = isOwnProfile ? MyTabs : OtherTabs;

  const getInitialTab = () => {
    const param = searchParams.get("tab");
    if (param && tabs.some((t) => t.id === param)) return param;
    if (isOwnProfile && !hasFirstRecord) return "calendar";
    return "recipes";
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const activeTabIndex = useMemo(
    () => tabs.findIndex((t) => t.id === activeTab),
    [tabs, activeTab]
  );

  const setActiveTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      triggerHaptic("Light");
      setActiveTabState(tabId);

      // URL 업데이트 (히스토리만, 네비게이션 없음)
      const params = new URLSearchParams(window.location.search);
      params.set("tab", tabId);
      window.history.replaceState(null, "", `?${params.toString()}`);
    },
    [activeTab]
  );

  // URL 변경 시 동기화
  useEffect(() => {
    const param = searchParams.get("tab");
    if (param && tabs.some((t) => t.id === param) && param !== activeTab) {
      setActiveTabState(param);
    }
  }, [searchParams, tabs, activeTab]);

  return { tabs, activeTab, activeTabIndex, setActiveTab };
};
