import CategoriesTabs from '@/components/CategoriesTabs';
import CateGoryItem from '@/components/CateGoryItem';
import { categoriesItems } from '@/mock';
import { useToastStore } from '@/store/useToastStore';
import { ChevronRight } from 'lucide-react';
import HomeHeader from './HomeHeader';
import RecipeSlide from './RecipeSlide';
const HomePage = () => {
  const { addToast, toastList } = useToastStore();
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-2 pb-20 text-gray-800">
      <HomeHeader />
      <div className="relative z-10">
        <CategoriesTabs title="카테고리" />
        <div className="bg-olive-light h-10 w-full rounded-lg">
          <p>AI 레시피 생성하러 가기 배너</p>
        </div>
        <RecipeSlide />
      </div>
    </div>
  );
};

export default HomePage;
