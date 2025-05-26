import React, { useState } from 'react';
import MyFavoriteRecipesTabContent from './MyFavoriteRecipesTabContent';
import CalendarTabContent from './CalendarTabContent';
import { User } from '@/type/user';
import { MyTabs, OtherTabs, Tab } from '@/constants/user';
import MyRecipesTabContent from './MyRecipesTabContent';

type UserTabProps = {
  displayUser: User;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
};

const UserTab = ({ displayUser, isOwnProfile, isLoggedIn }: UserTabProps) => {
  const [activeTab, setActiveTab] = useState<string>('나의 레시피');

  const getRecipesByTab = () => {
    switch (activeTab) {
      case '나의 레시피':
        return <MyRecipesTabContent userId={displayUser.id} />;
      case '북마크':
        return <MyFavoriteRecipesTabContent />;
      case '캘린더':
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
                  ? 'text-olive-light font-bold'
                  : 'text-gray-500'
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
