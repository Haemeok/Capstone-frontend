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
                "relative flex-1 cursor-pointer py-5 transition-colors",
                isActive ? "text-olive-light" : "text-gray-400"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="flex flex-col items-center gap-1.5">
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span
                  className={cn(
                    "text-xs transition-all",
                    isActive ? "font-bold" : "font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {/* 슬라이딩 인디케이터 */}
      <motion.div
        className="absolute bottom-0 h-[3px] rounded-full bg-olive-light"
        initial={false}
        animate={{
          left: `${activeTabIndex * tabWidth + tabWidth / 4}%`,
          width: `${tabWidth / 2}%`,
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
