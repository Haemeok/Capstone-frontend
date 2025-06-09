import {
  DetailedRecipesApiResponse,
  getRecipeItemsByTagNames,
  getRecipesByCategory,
} from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import { TAG_CODES_TO_NAME, TagCode } from '@/constants/recipe';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { InfiniteData, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import HomeBanner from './Home/HomeBanner';
import PrevButton from '@/components/Button/PrevButton';
import { getNextPageParam } from '@/utils/recipe';
import LoadingSection from './AIRecipe/LoadingSection';
import Circle from '@/components/Icon/Circle';

const CategoryDetailPage = () => {
  const { categorySlug: tagCode } = useParams<{ categorySlug: TagCode }>();
  const navigate = useNavigate();

  if (!tagCode) {
    navigate('/');
    return;
  }

  const tagName = TAG_CODES_TO_NAME[tagCode as keyof typeof TAG_CODES_TO_NAME];

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string],
    number
  >({
    queryKey: ['recipes', tagCode],
    queryFn: ({ pageParam }) =>
      getRecipeItemsByTagNames({ tagName: tagCode, pageParam }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content);

  return (
    <div className="bg-white p-2">
      <header className="relative flex items-center justify-center border-b border-gray-200 p-2">
        <PrevButton className="absolute left-2" />
        <h1 className="text-xl font-bold">{`${tagName} 레시피`}</h1>
      </header>
      {!isFetching && recipes && recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
        />
      ) : (
        <div className="flex h-[500px] w-full flex-col items-center justify-center p-4">
          {isFetching ? (
            <Circle className="text-olive-mint/60" size={32} />
          ) : (
            <>
              <p className="text-mm text-gray-500">
                {tagName} 레시피가 아직 없어요 !
              </p>
              <HomeBanner
                title="레시피 생성하러가기"
                description={`${tagName} 레시피를 만들어보세요!`}
                image="/robot1.png"
                to="/recipes/new"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;
