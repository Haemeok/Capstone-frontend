import { IngredientItem as IngredientItemType } from '@/type/recipe';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import SuspenseImage from '../Image/SuspenseImage';

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const IngredientItem = ({
  ingredient,
  isDeleteMode,
  setSelectedIngredientIds,
}: IngredientItemProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative flex items-center gap-4 rounded-lg border-[1.5px] border-gray-200 px-1 py-2">
      <SuspenseImage
        src={ingredient.imageUrl ?? ''}
        alt={ingredient.name}
        className="h-15 w-15 rounded-md"
      />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{ingredient.category}</span>
        <span className="text-sm font-semibold">{ingredient.name}</span>
      </div>
      {isDeleteMode && (
        <button
          onClick={() => {
            setIsActive(!isActive);
            setSelectedIngredientIds((prev) => [...prev, ingredient.id]);
          }}
          className={cn(
            'absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-gray-500 p-1',
            isActive ? 'bg-[#5cc570]' : '',
          )}
        />
      )}
    </div>
  );
};

export default IngredientItem;
