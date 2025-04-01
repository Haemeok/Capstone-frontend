import { ChefHat, Home, Refrigerator, Search, Sparkles } from "lucide-react";
import BottomNavButton from "./BottomNavButton";

const BottomNavBar = () => {
  return (
    <div className="fixed opacity-97 bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40">
      <BottomNavButton
        path="/"
        icon={<Home size={24} className="mb-1" />}
        label="홈"
      />
      <BottomNavButton
        path="/search"
        icon={<Search size={24} className="mb-1" />}
        label="검색"
      />
      <BottomNavButton
        path="/ingredients"
        icon={<Refrigerator size={24} className="mb-1" />}
        label="냉장고"
      />

      <BottomNavButton
        path="/air"
        icon={<Sparkles size={24} className="mb-1" />}
        label="AI 레시피"
      />

      <BottomNavButton
        path="/users/1"
        icon={<ChefHat size={24} className="mb-1" />}
        label="My"
      />
    </div>
  );
};

export default BottomNavBar;
