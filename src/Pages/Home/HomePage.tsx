import CategoriesTabs from '@/components/CategoriesTabs';
import { createdRecipes } from '@/mock';
import { useToastStore } from '@/store/useToastStore';
import HomeHeader from './HomeHeader';
import RecipeSlide from './RecipeSlide';
import HomeBanner from './HomeBanner';
const HomePage = () => {
  const { addToast, toastList } = useToastStore();
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white p-6 text-gray-800">
      <HomeHeader />

      <CategoriesTabs title="카테고리" />
      <HomeBanner />
      <RecipeSlide title="추천 레시피" recipes={createdRecipes} />
      <RecipeSlide title="홈파티 레시피" recipes={createdRecipes} />
    </div>
  );
};

export default HomePage;
