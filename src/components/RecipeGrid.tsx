import { RecipeGridItem } from '@/type/recipe';
import ToggleIconButton from './Button/ToggleIconButton';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

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
            className="overflow-hidden rounded-2xl bg-white shadow-md"
            onClick={() => {
              navigate(`/recipes/${recipe.id}`);
            }}
          >
            <div className="relative h-48">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-0 right-0 p-2 text-right">
                <ToggleIconButton
                  icon={<Heart />}
                  onClick={() => {}}
                  className="text-right text-white"
                />
              </div>
              <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-sm font-semibold text-white">
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
