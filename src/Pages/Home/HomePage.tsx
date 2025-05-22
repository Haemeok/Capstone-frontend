import CategoriesTabs from '@/components/CategoriesTabs';
import { createdRecipes } from '@/mock';
import { useToastStore } from '@/store/useToastStore';
import HomeHeader from './HomeHeader';
import RecipeSlide from './RecipeSlide';
import HomeBanner from './HomeBanner';
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white p-6 text-gray-800">
      <HomeHeader />

      <CategoriesTabs title="카테고리" />
      <HomeBanner
        title="AI 레시피 생성하기"
        description="AI가 추천하는 레시피를 확인해보세요!"
        image="/robot1.png"
        to="/ai-recipe"
      />
      <RecipeSlide title="추천 레시피" recipes={createdRecipes} />
      <RecipeSlide title="홈파티 레시피" recipes={createdRecipes} />
    </div>
  );
};

export default HomePage;
