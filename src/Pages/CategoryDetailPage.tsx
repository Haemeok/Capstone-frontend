import { getRecipesByCategory } from '@/api/recipe';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const CategoryDetailPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  if (!categorySlug) {
    return <div>유효하지 않은 카테고리입니다.</div>;
  }

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes', categorySlug],
    queryFn: () => {
      return getRecipesByCategory(categorySlug!);
    },
    enabled: !!categorySlug,
  });
  const categoryTitle =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{`${categoryTitle} 레시피`}</h1>
      {recipes && recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <div>레시피가 없습니다.</div>
      )}
      {/* 페이지네이션 UI 추가 가능 */}
    </div>
  );
};

export default CategoryDetailPage;
