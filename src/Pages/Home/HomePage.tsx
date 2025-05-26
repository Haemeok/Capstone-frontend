import CategoriesTabs from '@/components/CategoriesTabs';
import { createdRecipes } from '@/mock';
import HomeHeader from './HomeHeader';
import RecipeSlide from './RecipeSlide';
import HomeBanner from './HomeBanner';
import { OnboardingSurveyModal } from './OnboardingSurveyModal';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white p-4 text-gray-800">
      <HomeHeader />
      <button onClick={() => setIsSurveyOpen(true)}>설문조사 보기</button>
      <CategoriesTabs title="카테고리" />
      <HomeBanner
        title="AI 레시피 생성하기"
        description="AI가 추천하는 레시피를 확인해보세요!"
        image="/robot1.png"
        to="/ai-recipe"
      />
      <RecipeSlide title="추천 레시피" recipes={createdRecipes} />
      <RecipeSlide title="홈파티 레시피" recipes={createdRecipes} />
      <OnboardingSurveyModal
        isOpen={isSurveyOpen}
        onOpenChange={setIsSurveyOpen}
        onSurveyComplete={() => {}}
      />
    </div>
  );
};

export default HomePage;
