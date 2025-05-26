import { ChefHat, Home, Refrigerator, Search, Sparkles } from 'lucide-react';
import BottomNavButton from './BottomNavButton';
import { useUserStore } from '@/store/useUserStore';

const BottomNavBar = () => {
  const { user } = useUserStore();
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 opacity-97">
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
        path="/ai-recipe"
        icon={<Sparkles size={24} className="mb-1" />}
        label="AI 레시피"
      />

      <BottomNavButton
        path={`/users/${user?.id ?? 'guestUser'}`}
        icon={<ChefHat size={24} className="mb-1" />}
        label="My"
      />
    </footer>
  );
};

export default BottomNavBar;
