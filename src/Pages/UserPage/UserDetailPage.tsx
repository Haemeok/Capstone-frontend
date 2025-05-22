import React, { useState } from 'react';
import { Edit, LogIn, Plus, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';
import MyRecipesTabContent from './MyRecipesTabContent';
import CalendarTabContent from './CalendarTabContent';
import MyFavoriteRecipesTabContent from './MyFavoriteRecipesTabContent';
import useLogoutMutation from '@/hooks/useLogoutMutation';
import { guestUser, tabs } from '@/constants/user';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

const UserDetailPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('나의 레시피');
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  const displayUser = user ? user : guestUser;

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateRecipeClick = () => {
    navigate('/recipes/new');
  };

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

  return (
    <div className="bg-cgray flex min-h-screen flex-col overflow-hidden">
      <div className="z-30 flex justify-between bg-white p-4">
        <h2 className="text-2xl font-bold">프로필</h2>
        <button onClick={() => setIsModalOpen(true)}>
          <Settings size={20} className="mr-1" />
        </button>
      </div>

      <div className="relative z-10 px-6">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl">
                <img
                  src={displayUser.profileImage}
                  alt={displayUser.nickname}
                  className="h-full w-full object-cover"
                />
              </div>
              {user && (
                <div className="bg-olive-light absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md">
                  <Edit size={14} className="text-white" />
                </div>
              )}
            </div>

            <h2 className="text-dark mb-5 text-2xl font-bold">
              {displayUser.nickname}
            </h2>
          </div>
          {!user ? (
            <Button
              className="bg-olive-medium hover:bg-olive-dark rounded-full px-6 text-white"
              onClick={handleLoginClick}
            >
              <LogIn size={16} className="mr-1" /> 로그인
            </Button>
          ) : (
            <Button
              className="bg-olive-light gap-0 rounded-full px-6 text-white"
              onClick={handleCreateRecipeClick}
            >
              <Plus size={16} className="mr-1" /> 레시피 생성하러가기
            </Button>
          )}
        </div>

        <p className="mt-3 max-w-[90%] text-sm text-black/90">
          {displayUser.profileContent}
        </p>
      </div>

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

      {user ? (
        getRecipesByTab()
      ) : (
        <div className="flex grow flex-col items-center justify-center p-10 text-center">
          <p className="mb-4 text-gray-500">
            로그인하여 레시피와 요리 일정을 관리해보세요.
          </p>
        </div>
      )}
      {isModalOpen && (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle className="text-lg">설정</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter className="gap-0">
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center gap-1 border-t-1 border-gray-200 px-4 py-2 font-semibold text-red-500"
              >
                <LogOut size={16} className="mr-1" />
                <p>로그아웃</p>
              </button>
              <DrawerClose asChild>
                <button className="text-dark rounded-md border-t-1 border-gray-200 px-4 py-2 font-semibold">
                  닫기
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default UserDetailPage;
