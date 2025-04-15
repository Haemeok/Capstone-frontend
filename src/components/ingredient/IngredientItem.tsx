import { IngredientItem as IngredientItemType } from '@/type/recipe';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import ToggleIconButton from '../Button/ToggleIconButton';
import { cn } from '@/lib/utils';

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
};

const IngredientItem = ({ ingredient, isDeleteMode }: IngredientItemProps) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="relative flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 px-1 py-2">
      <img
        src={ingredient.imageUrl}
        alt={ingredient.name}
        className="h-15 w-15 rounded-md"
      />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{ingredient.category}</span>
        <span className="text-sm font-semibold">{ingredient.name}</span>
      </div>
      {isDeleteMode && (
        <button
          onClick={() => setIsActive(!isActive)}
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
