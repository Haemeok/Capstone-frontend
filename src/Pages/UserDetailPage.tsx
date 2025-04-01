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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeGridItem } from "@/type/recipe";
import RecipeGrid from "@/components/RecipeGrid";
import { createdRecipes, cookbookRecipes } from "@/mock";
import CalendarBoard from "@/components/CalendarBoard";

interface UserProfileProps {
  user: User;
  onBack?: () => void;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const UserDetailPage = ({ user, onBack }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState<string>("created");

  // 탭 설정
  const tabs: Tab[] = [
    { id: "created", label: "Created", icon: Award },
    { id: "cookbooks", label: "Cookbooks", icon: BookOpen },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  // 활성 탭에 따른 레시피 선택
  const getRecipesByTab = () => {
    switch (activeTab) {
      case "created":
        return <RecipeGrid recipes={createdRecipes} activeTab={activeTab} />;
      case "cookbooks":
        return <RecipeGrid recipes={cookbookRecipes} activeTab={activeTab} />;
      case "calendar":
        return <CalendarBoard />;
      default:
        return <RecipeGrid recipes={createdRecipes} activeTab={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* 상단 네비게이션 */}
      <div className="relative h-[280px] overflow-hidden">
        {/* 네비게이션 바 */}
        <div className="relative z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="text-black p-2 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <Button variant="ghost" className="text-black p-2 rounded-full">
            <Settings size={20} />
          </Button>
        </div>

        {/* 프로필 정보 */}
        <div className="relative z-10 px-6">
          <div className="flex items-end">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl">
                <img
                  src={user.imageURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#5cc570] rounded-full flex items-center justify-center shadow-md">
                <Edit size={14} className="text-white" />
              </div>
            </div>

            <div className="ml-4 mb-2">
              <h2 className="text-black text-2xl font-bold">{user.name}</h2>
              <p className="text-black/80 text-sm">
                {user.username ||
                  "@" + user.name.toLowerCase().replace(/\s/g, "")}
              </p>
            </div>
          </div>

          <p className="text-black/90 text-sm mt-3 max-w-[90%]">
            {user.profileContent || "MAKING money | HEALTH FOOD EATING ✓ 🔥"}
          </p>

          {/* 액션 버튼 */}
          <div className="flex gap-2 mt-4">
            <Button className="bg-white text-[#5cc570] hover:bg-white/90 px-4 rounded-full">
              <Share size={16} className="mr-1" /> Share
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-black text-black hover:bg-white/20 px-4 rounded-full"
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-4 relative ${
                activeTab === tab.id
                  ? "text-[#5cc570] font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="flex flex-col items-center">
                <tab.icon size={18} className="mb-1" />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5cc570]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {getRecipesByTab()}
    </div>
  );
};

export default UserDetailPage;
