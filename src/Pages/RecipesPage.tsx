import useRecipeItemsQuery from '@/hooks/useRecipeItemsQuery';
import { Link } from 'react-router';

const RecipesPage = () => {
  const { data, isLoading, error } = useRecipeItemsQuery();

  const recipes = [
    { id: 1, title: 'Pasta Carbonara' },
    { id: 2, title: 'Chicken Curry' },
    { id: 3, title: 'Vegetable Stir Fry' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Recipes</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((recipe) => (
          <div key={recipe.id} className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <Link
              to={`/recipes/${recipe.id}`}
              className="mt-2 inline-block text-blue-500 hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
