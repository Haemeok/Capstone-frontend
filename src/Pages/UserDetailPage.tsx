import React, { useState } from 'react';
import { User } from '@/type/user';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Share,
  Edit,
  Heart,
  Clock,
  ChevronLeft,
  BookOpen,
  LucideIcon,
  Award,
  Users,
  Bookmark,
  Calendar,
  LogIn,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeGridItem } from '@/type/recipe';
import RecipeGrid from '@/components/RecipeGrid';
import { createdRecipes, cookbookRecipes } from '@/mock';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const UserDetailPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('나의 레시피');

  const guestUser: User = {
    id: 0,
    nickname: '게스트',
    profileImage: '/default-profile.png',
    username: '@guest',
    profileContent: '로그인하여 더 많은 기능을 사용해보세요.',
  };

  const displayUser = user ? user : guestUser;

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateRecipeClick = () => {
    navigate('/recipes/new');
  };

  const tabs: Tab[] = [
    { id: '나의 레시피', label: '나의 레시피', icon: Award },
    { id: '북마크', label: '북마크', icon: BookOpen },
    { id: '캘린더', label: '캘린더', icon: Calendar },
  ];

  const getRecipesByTab = () => {
    switch (activeTab) {
      case '나의 레시피':
        return <RecipeGrid recipes={createdRecipes} isSimple={false} />;
      case '북마크':
        return <RecipeGrid recipes={cookbookRecipes} isSimple={true} />;
      case '캘린더':
        return <></>;
      default:
        return <RecipeGrid recipes={createdRecipes} />;
    }
  };

  return (
    <div className="mt-20 min-h-screen overflow-hidden">
      <div className="fixed top-0 right-0 left-0 z-30 bg-white p-4">
        <h2 className="text-2xl font-bold">프로필</h2>
      </div>

      <div className="relative z-10 px-6">
        <div className="flex items-end justify-between">
          <div className="flex items-end">
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

            <div className="mb-2 ml-4">
              <h2 className="text-2xl font-bold text-black">
                {displayUser.nickname}
              </h2>
              <p className="text-sm text-black/80">
                {displayUser.username ||
                  '@' + displayUser.nickname.toLowerCase().replace(/\s/g, '')}
              </p>
            </div>
          </div>
          {!user ? (
            <Button
              className="bg-olive hover:bg-olive-dark rounded-full px-6 text-white"
              onClick={handleLoginClick}
            >
              <LogIn size={16} className="mr-1" /> 로그인
            </Button>
          ) : (
            <Button
              className="bg-olive hover:bg-olive-dark gap-0 rounded-full px-6 text-white"
              onClick={handleCreateRecipeClick}
            >
              <Plus size={16} className="mr-1" /> 레시피 생성하러가기
            </Button>
          )}
        </div>

        <p className="mt-3 max-w-[90%] text-sm text-black/90">
          {!user ? displayUser.profileContent : '테스트 상태메세지'}
        </p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`relative flex-1 py-4 ${
                activeTab === tab.id ? 'text-olive font-bold' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="flex flex-col items-center">
                <tab.icon size={18} className="mb-1" />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="bg-olive absolute right-0 bottom-0 left-0 h-[3px]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {user ? (
        getRecipesByTab()
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <p className="mb-4 text-gray-500">
            로그인하여 레시피와 요리 일정을 관리해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
