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

  const stats = [
    { label: "팔로워", value: user.followers || 0, icon: Users },
    { label: "팔로잉", value: user.following || 0, icon: Users },
    { label: "북마크", value: user.bookmarks || 0, icon: Bookmark },
    { label: "좋아요", value: user.likes || 1, icon: Heart },
  ];

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
    <div className="min-h-screen bg-[#f4f3e7] overflow-hidden">
      {/* 상단 네비게이션 */}
      <motion.div
        className="relative h-[280px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00473c] to-[#00473c]/50">
          <div className="absolute inset-0 bg-[url('/patterns/gourmet-pattern.png')] bg-cover opacity-10"></div>
        </div>

        {/* 네비게이션 바 */}
        <div className="relative z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="text-white p-2 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-lg">Your Profile</h1>
          <Button variant="ghost" className="text-white p-2 rounded-full">
            <Settings size={20} />
          </Button>
        </div>

        {/* 프로필 정보 */}
        <motion.div
          className="relative z-10 px-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-end">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl">
                <img
                  src={user.imageURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#ff9b50] rounded-full flex items-center justify-center shadow-md">
                <Edit size={14} className="text-white" />
              </div>
            </motion.div>

            <div className="ml-4 mb-2">
              <motion.h2
                className="text-white text-2xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {user.name}
              </motion.h2>
              <motion.p
                className="text-white/80 text-sm"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {user.username ||
                  "@" + user.name.toLowerCase().replace(/\s/g, "")}
              </motion.p>
            </div>
          </div>

          <motion.p
            className="text-white/90 text-sm mt-3 max-w-[90%]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {user.profileContent || "MAKING money | HEALTH FOOD EATING ✓ 🔥"}
          </motion.p>

          {/* 액션 버튼 */}
          <div className="flex gap-2 mt-4">
            <Button className="bg-white text-[#00473c] hover:bg-white/90 px-4 rounded-full">
              <Share size={16} className="mr-1" /> Share
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/20 px-4 rounded-full"
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* 통계 정보 */}
      <motion.div
        className="px-4 pt-5 pb-3 grid grid-cols-4 gap-2 border-b border-gray-200"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <p className="text-xl font-bold text-[#00473c]">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex-1 py-4 relative ${
                activeTab === tab.id
                  ? "text-[#00473c] font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ backgroundColor: "rgba(0, 71, 60, 0.05)" }}
            >
              <span className="flex flex-col items-center">
                <tab.icon size={18} className="mb-1" />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00473c]"
                  layoutId="activeTab"
                  initial={false}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {getRecipesByTab()}
    </div>
  );
};

export default UserDetailPage;
