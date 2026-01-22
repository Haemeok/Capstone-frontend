"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { MyTabs, OtherTabs } from "@/shared/config/constants/user";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { User } from "@/entities/user";

import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

const MyRecipesTabContent = dynamic(
  () => import("@/widgets/MyRecipesTabContent"),
  {
    loading: () => (
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] p-4">
        <RecipeGridSkeleton count={8} isSimple />
      </div>
    ),
  }
);

const MyFavoriteRecipesTabContent = dynamic(
  () =>
    import("@/features/view-favorite-recipes").then((mod) => ({
      default: mod.MyFavoriteRecipesTabContent,
    })),
  {
    loading: () => (
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] p-4">
        <RecipeGridSkeleton count={8} isSimple={false} />
      </div>
    ),
  }
);

const CalendarTabContent = dynamic(
  () => import("@/widgets/CalendarTabContent"),
  {
    loading: () => (
      <div className="p-4">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    ),
  }
);

type UserTabProps = {
  user: User | undefined;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
};

const UserTab = ({ user, isOwnProfile, isLoggedIn }: UserTabProps) => {
  const searchParams = useSearchParams();

  const getDefaultTab = () => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const validTabs = isOwnProfile ? MyTabs : OtherTabs;
      const isValidTab = validTabs.some((tab) => tab.id === tabParam);
      if (isValidTab) {
        return tabParam;
      }
    }

    if (isOwnProfile && user && !user.hasFirstRecord) {
      return "calendar";
    }
    return "recipes";
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const validTabs = isOwnProfile ? MyTabs : OtherTabs;
      const isValidTab = validTabs.some((tab) => tab.id === tabParam);
      if (isValidTab) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams, isOwnProfile]);

  const getRecipesByTab = () => {
    switch (activeTab) {
      case "recipes":
        return user && <MyRecipesTabContent userId={user.id} isOwnProfile={isOwnProfile} />;
      case "saved":
        return <MyFavoriteRecipesTabContent />;
      case "calendar":
        return <CalendarTabContent />;
      default:
        return <></>;
    }
  };

  const tabs = isOwnProfile ? MyTabs : OtherTabs;

  return (
    <>
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`relative flex-1 cursor-pointer py-4 ${
                activeTab === tab.id
                  ? "text-olive-light font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => {
                if (activeTab !== tab.id) {
                  triggerHaptic("Light");
                  setActiveTab(tab.id);
                }
              }}
            >
              <span className="flex flex-col items-center">
                <tab.icon size={18} className="mb-1" />
              </span>
              {activeTab === tab.id && (
                <div className="bg-olive-light absolute bottom-0 left-1/2 h-[3px] w-1/3 -translate-x-1/2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {!isLoggedIn && user?.id === "0" ? (
        <div className="flex grow flex-col items-center justify-center p-10 text-center">
          <p className="mb-4 text-gray-500">
            로그인하여 레시피와 요리 일정을 관리해보세요.
          </p>
        </div>
      ) : (
        getRecipesByTab()
      )}
    </>
  );
};

export default UserTab;
