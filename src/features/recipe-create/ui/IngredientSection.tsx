"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Plus } from "lucide-react";

import { IngredientPayload } from "@/entities/ingredient";

import { RecipeFormValues } from "../model/config";
import IngredientItem from "./IngredientItem";
import IngredientSelector from "./IngredientSelector";
import CookingUnitTooltip from "@/shared/ui/CookingUnitTooltip";
import { FIELD_LABELS } from "../model/constants";

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
      <h2 className="text-xl font-bold text-gray-700">
        {FIELD_LABELS.ingredients}
      </h2>

      <CookingUnitTooltip />

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
      <button
        type="button"
        className="group border-olive-light text-olive-medium hover:bg-olive-light/15 mt-4 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-dashed py-2 transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <Plus
          size={16}
          className="transition-transform group-hover:scale-105"
        />
        <span className="transition-transform group-hover:scale-105">
          재료 추가하기
        </span>
      </button>

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
