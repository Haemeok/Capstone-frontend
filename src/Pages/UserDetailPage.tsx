import React, { useState } from "react";
import { User } from "@/type/user";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeGridItem } from "@/type/recipe";
import RecipeGrid from "@/components/RecipeGrid";
import { createdRecipes, cookbookRecipes } from "@/mock";
import CalendarBoard from "@/components/CalendarBoard";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const UserDetailPage = () => {
  let { user, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("created");

  const guestUser = {
    name: "게스트",
    imageURL: "/default-profile.png",
    username: "@guest",
    profileContent: "로그인하여 더 많은 기능을 사용해보세요.",
  };

  const displayUser = isLoggedIn && user ? user : guestUser;

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCreateRecipeClick = () => {
    navigate("/recipes/new");
  };

  isLoggedIn = true;
  const tabs: Tab[] = [
    { id: "나의 레시피", label: "나의 레시피", icon: Award },
    { id: "북마크", label: "북마크", icon: BookOpen },
    { id: "캘린더", label: "캘린더", icon: Calendar },
  ];

  // 활성 탭에 따른 레시피 선택
  const getRecipesByTab = () => {
    switch (activeTab) {
      case "나의 레시피":
        return <RecipeGrid recipes={createdRecipes} />;
      case "북마크":
        return <RecipeGrid recipes={cookbookRecipes} />;
      case "캘린더":
        return <CalendarBoard />;
      default:
        return <RecipeGrid recipes={createdRecipes} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* 상단 네비게이션 */}

      {/* 프로필 정보 */}
      <div className="relative z-10 px-6">
        <div className="flex justify-between items-end">
          <div className="flex items-end">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl">
                <img
                  src={displayUser.imageURL}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isLoggedIn && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#58C16A] rounded-full flex items-center justify-center shadow-md">
                  <Edit size={14} className="text-white" />
                </div>
              )}
            </div>

            <div className="ml-4 mb-2">
              <h2 className="text-black text-2xl font-bold">
                {displayUser.name}
              </h2>
              <p className="text-black/80 text-sm">
                {displayUser.username ||
                  "@" + displayUser.name.toLowerCase().replace(/\s/g, "")}
              </p>
            </div>
          </div>
          {!isLoggedIn ? (
            <Button
              className="bg-[#58C16A] text-white hover:bg-[#4CAF50] px-6 rounded-full"
              onClick={handleLoginClick}
            >
              <LogIn size={16} className="mr-1" /> 로그인
            </Button>
          ) : (
            <Button
              className="bg-[#58C16A] text-white hover:bg-[#4CAF50] px-6 rounded-full gap-0"
              onClick={handleCreateRecipeClick}
            >
              <Plus size={16} className="mr-1" /> 레시피 생성하러가기
            </Button>
          )}
        </div>

        <p className="text-black/90 text-sm mt-3 max-w-[90%]">
          {!isLoggedIn ? displayUser.profileContent : "테스트 상태메세지"}
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-4 relative ${
                activeTab === tab.id
                  ? "text-[#58C16A] font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="flex flex-col items-center">
                <tab.icon size={18} className="mb-1" />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#58C16A]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoggedIn ? (
        getRecipesByTab()
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <p className="text-gray-500 mb-4">
            로그인하여 레시피와 요리 일정을 관리해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
