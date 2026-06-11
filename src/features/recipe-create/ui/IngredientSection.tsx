"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";

import { Plus } from "lucide-react";

import { INGREDIENT_CATEGORIES_NEW_RECIPE } from "@/shared/config/constants/recipe";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

import { IngredientPayload } from "@/entities/ingredient";
import { IngredientPicker } from "@/entities/ingredient/ui/IngredientPicker";

import { buildCustomIngredient } from "../lib/buildCustomIngredient";
import { RecipeFormValues } from "../model/config";
import CustomIngredientInput from "./CustomIngredientInput";
import IngredientItem from "./IngredientItem";
import type OriginalIngredientSelector from "./IngredientSelector";

const IngredientSelector = dynamic(() => import("./IngredientSelector"), {
  ssr: false,
}) as unknown as typeof OriginalIngredientSelector;
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

  const isMobile = useMediaQuery("(max-width: 768px)");

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
      ingredientId: ingredient.id ?? "",
      name: ingredient.name,
      quantity: "",
      unit: ingredient.unit,
    });
  };

  const handleAddCustom = (name: string) => {
    const custom = buildCustomIngredient(name, addedIngredientNames);
    if (!custom) return false;
    addIngredient(custom);
    return true;
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

      <CustomIngredientInput onAdd={handleAddCustom} />

      {isMobile ? (
        <IngredientPicker
          open={isOpen}
          onOpenChange={setIsOpen}
          categories={INGREDIENT_CATEGORIES_NEW_RECIPE}
          initialCategory="전체"
          queryConfig={{
            keyBase: "drawerIngredients",
            getParams: (category) => ({
              category,
              isMine: category === "나의 재료",
            }),
          }}
          isAlreadyAdded={(ingredient) =>
            addedIngredientNames.has(ingredient.name)
          }
          onComplete={(items) =>
            items.forEach((i) =>
              addIngredient({
                id: i.id,
                name: i.name,
                quantity: "",
                unit: i.unit,
              })
            )
          }
        />
      ) : (
        <IngredientSelector
          open={isOpen}
          onOpenChange={setIsOpen}
          onIngredientSelect={addIngredient}
          addedIngredientNames={addedIngredientNames}
          mapIngredientToPayload={(ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            quantity: "",
            unit: ingredient.unit,
          })}
        />
      )}
    </div>
  );
};

export default IngredientSection;
