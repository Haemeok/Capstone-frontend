import { RecipeGridItem } from "@/type/recipe";
import ToggleIconButton from "./Button/ToggleIconButton";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";

type RecipeGridProps = {
  recipes: RecipeGridItem[];
};

const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-2xl overflow-hidden bg-white shadow-md"
            onClick={() => {
              navigate(`/recipes/${recipe.id}`);
            }}
          >
            <div className="relative h-48">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="text-right absolute top-0 right-0 p-2">
                <ToggleIconButton
                  icon={<Heart />}
                  onClick={() => {}}
                  className="text-white text-right"
                />
              </div>
              <div className="absolute flex items-end h-1/3 bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-semibold">
                  {recipe.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
