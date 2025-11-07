"use client";

import React, { useState } from "react";

import { MyTabs, OtherTabs } from "@/shared/config/constants/user";

import { User } from "@/entities/user";

import { MyFavoriteRecipesTabContent } from "@/features/view-favorite-recipes";

import CalendarTabContent from "@/widgets/CalendarTabContent";
import MyRecipesTabContent from "@/widgets/MyRecipesTabContent";

type UserTabProps = {
  user: User | undefined;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
};

const UserTab = ({ user, isOwnProfile, isLoggedIn }: UserTabProps) => {
  const getDefaultTab = () => {
    if (isOwnProfile && user && !user.hasFirstRecord) {
      return "캘린더";
    }
    return "나의 레시피";
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());

  const getRecipesByTab = () => {
    switch (activeTab) {
      case "나의 레시피":
        return user && <MyRecipesTabContent userId={user.id} />;
      case "북마크":
        return <MyFavoriteRecipesTabContent />;
      case "캘린더":
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
              className={`relative flex-1 py-4 ${
                activeTab === tab.id
                  ? "text-olive-light font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
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

      {!isLoggedIn && !isOwnProfile ? (
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
