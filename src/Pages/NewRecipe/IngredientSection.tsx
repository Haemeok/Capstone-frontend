import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IngredientPayload, RecipeFormValues } from '@/type/recipe';
import { ChefHat } from 'lucide-react';
import React, { useState } from 'react';
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import IngredientSelector from './IngredientSelector';

type IngredientSectionProps = {
  control: Control<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  onRemoveIngredientCallback: (ingredientName: string) => void;
};

const IngredientSection = ({
  control,
  errors,
  register,
  onRemoveIngredientCallback,
}: IngredientSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [addedIngredientIds, setAddedIngredientIds] = useState<Set<number>>(
    new Set(),
  );

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const addIngredient = (ingredient: IngredientPayload) => {
    appendIngredient({
      name: ingredient.name,
      quantity: '',
      unit: ingredient.unit,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const ingredientNameToRemove = ingredientFields[index]?.name;
    removeIngredient(index);
    if (ingredientNameToRemove) {
      onRemoveIngredientCallback(ingredientNameToRemove);
    }
  };

  return (
    <div className="mb-4">
      {ingredientFields.length > 0 && (
        <div className="flex h-16 items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-xl font-semibold text-gray-700">재료</h2>
        </div>
      )}

      <div className="space-y-3 pt-4">
        {ingredientFields.map((field, index) => (
          <div
            key={field.id}
            className="flex min-h-16 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                <ChefHat size={20} className="text-olive-light" />
              </div>

              <div className="flex h-full flex-1 items-center justify-between gap-2">
                <p className="flex-1 font-medium text-gray-800">{field.name}</p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`w-20 rounded border border-gray-300 px-2 py-1 text-right focus:border-green-500 focus:outline-none ${errors.ingredients?.[index]?.quantity ? 'border-red-500' : ''}`}
                    {...register(`ingredients.${index}.quantity`, {
                      required: '수량/단위를 입력해주세요.',
                    })}
                  />
                  <p className="w-10 text-gray-500">{field.unit}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
            {errors.ingredients?.[index]?.quantity && (
              <p className="w-full text-right text-xs text-red-500">
                {errors.ingredients[index]?.quantity?.message}
              </p>
            )}
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-olive-light text-olive-medium mt-4 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed py-3 hover:text-white"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} />
        재료 추가하기
      </Button>

      <IngredientSelector
        open={isOpen}
        onOpenChange={setIsOpen}
        onIngredientSelect={addIngredient}
        addedIngredientIds={addedIngredientIds}
        setAddedIngredientIds={setAddedIngredientIds}
      />
    </div>
  );
};

export default IngredientSection;
