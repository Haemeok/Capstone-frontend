import useRecipeItemsQuery from "@/hooks/useRecipeItemsQuery";
import { Link } from "react-router";

const RecipesPage = () => {
  const { data, isLoading, error } = useRecipeItemsQuery();

  const recipes = [
    { id: 1, title: "Pasta Carbonara" },
    { id: 2, title: "Chicken Curry" },
    { id: 3, title: "Vegetable Stir Fry" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {data?.map((recipe) => (
          <div key={recipe.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <Link
              to={`/recipes/${recipe.id}`}
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
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
