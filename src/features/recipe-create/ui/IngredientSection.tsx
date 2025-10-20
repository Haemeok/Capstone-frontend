"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import { IngredientPayload } from "@/entities/ingredient";

import { RecipeFormValues } from "../model/config";
import IngredientItem from "./IngredientItem";
import IngredientSelector from "./IngredientSelector";

type IngredientSectionProps = {
  onRemoveIngredientCallback: (ingredientName: string) => void;
};

const IngredientSection = ({
  onRemoveIngredientCallback,
}: IngredientSectionProps) => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<RecipeFormValues>();

  const [isOpen, setIsOpen] = useState(false);

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const addedIngredientNames = new Set(
    ingredientFields.map((field) => field.name)
  );

  const addIngredient = (ingredient: IngredientPayload) => {
    appendIngredient({
      name: ingredient.name,
      quantity: "",
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
      <h2 className="text-xl font-bold text-gray-700">재료</h2>

      <div className="space-y-3 pt-4">
        {ingredientFields.map((field, index) => (
          <IngredientItem
            key={field.id}
            field={field}
            index={index}
            onRemove={handleRemoveIngredient}
            register={register}
            error={errors.ingredients?.[index]?.quantity}
          />
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
        addedIngredientNames={addedIngredientNames}
      />
    </div>
  );
};

export default IngredientSection;
