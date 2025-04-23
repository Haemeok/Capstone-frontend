import { RecipeGridItem as RecipeGridItemType } from '@/type/recipe';
import ToggleIconButton from './Button/ToggleIconButton';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import HeartButton from './Button/HeartButton';
import SuspenseImage from './Image/SuspenseImage';
import RecipeGridItem from './RecipeGridItem';

type RecipeGridProps = {
  recipes: RecipeGridItemType[];
  isSimple?: boolean;
};

const RecipeGrid = ({ recipes, isSimple = false }: RecipeGridProps) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 gap-y-6">
        {recipes.map((recipe) => (
          <RecipeGridItem key={recipe.id} recipe={recipe} isSimple={isSimple} />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
