"use client";

import { motion } from "framer-motion";

import { Tab } from "@/shared/config/constants/user";
import { cn } from "@/shared/lib/utils";

type TabNavigationProps = {
  tabs: Tab[];
  activeTab: string;
  activeTabIndex: number;
  onTabChange: (tabId: string) => void;
};

export const TabNavigation = ({
  tabs,
  activeTab,
  activeTabIndex,
  onTabChange,
}: TabNavigationProps) => {
  const tabWidth = 100 / tabs.length;

  return (
    <div className="relative border-b border-gray-100">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "relative flex-1 cursor-pointer py-4 text-sm transition-colors",
                isActive ? "font-bold text-black" : "font-medium text-gray-400"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <motion.div
        className="absolute bottom-0 h-[2px] bg-black"
        initial={false}
        animate={{
          left: `${activeTabIndex * tabWidth}%`,
          width: `${tabWidth}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 40,
        }}
      />
    </div>
  );
};
