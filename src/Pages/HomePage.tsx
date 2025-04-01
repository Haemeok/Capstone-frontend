import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChefHat,
  Sparkles,
  PlusCircle,
  Search,
  Utensils,
  ShoppingBag,
  Heart,
  MenuSquare,
  ArrowRight,
  Book,
  Clock,
  Lock,
  Award,
  ChevronRight,
  Bell,
  Home,
  Refrigerator,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import CategoriesTabs from "@/components/CategoriesTabs";

// 메인 카테고리 데이터
const categories = [
  {
    id: "hot-meals",
    title: "따뜻한 식사",
    count: 214,
    icon: <Utensils size={24} />,
    color: "from-[#FF7E45] to-[#FF5F19]",
    image: "/images/categories/hot-meals.jpg",
  },
  {
    id: "snacks",
    title: "간식",
    count: 116,
    icon: <Award size={24} />,
    color: "from-[#69C577] to-[#41A651]",
    image: "/images/categories/snacks.jpg",
  },
  {
    id: "desserts",
    title: "디저트",
    count: 89,
    icon: <Heart size={24} />,
    color: "from-[#FF99A6] to-[#FF6B7E]",
    image: "/images/categories/desserts.jpg",
  },
  {
    id: "drinks",
    title: "음료",
    count: 64,
    icon: <Award size={24} />,
    color: "from-[#7EB9FF] to-[#4A90E2]",
    image: "/images/categories/drinks.jpg",
  },
];

// 교육 콘텐츠 데이터
const educationContent = [
  {
    id: 1,
    title: "저탄수화물 식단",
    subtitle: "건강한 식단",
    image: "/images/education/low-carb.jpg",
    color: "from-[#FFD27D] to-[#FFBD3D]",
  },
  {
    id: 2,
    title: "면역력 강화 식품",
    subtitle: "건강과 영양",
    image: "/images/education/immunity.jpg",
    color: "from-[#7DCB9F] to-[#3DAF7E]",
  },
  {
    id: 3,
    title: "계절 식재료 가이드",
    subtitle: "신선한 식재료",
    image: "/images/education/seasonal.jpg",
    color: "from-[#E07D9F] to-[#C73D6F]",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(0);

  // 요리 추천 데이터
  const recommendedRecipes = [
    {
      id: 1,
      title: "트러플 리조또",
      desc: "고급스러운 풍미가 일품인 리조또",
      image: "/recipes/truffle-risotto.jpg",
      time: "45분",
      difficulty: "중급",
      rating: 4.8,
    },
    {
      id: 2,
      title: "연어 스테이크",
      desc: "오메가-3가 풍부한 건강식",
      image: "/recipes/salmon-steak.jpg",
      time: "30분",
      difficulty: "초급",
      rating: 4.6,
    },
    {
      id: 3,
      title: "말차 티라미수",
      desc: "동서양의 맛이 조화로운 디저트",
      image: "/recipes/matcha-tiramisu.jpg",
      time: "60분",
      difficulty: "고급",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#222222] overflow-x-hidden">
      {/* 검색창 */}
      <div className="absolute -bottom-8 left-0 right-0 px-6 z-30">
        <div className="bg-white rounded-xl shadow-xl flex items-center p-4 pl-5">
          <Search size={22} className="text-[#00473c] mr-3" />
          <input
            type="text"
            placeholder="원하는 레시피나 재료를 검색해보세요"
            className="flex-1 bg-transparent focus:outline-none text-[#333333] text-lg"
          />
        </div>
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div className="relative pt-16 pb-24 z-10">
        {/* 카테고리 섹션 */}
        <CategoriesTabs />
      </div>

      {/* 하단 탭 네비게이션 */}
    </div>
  );
};

export default HomePage;
