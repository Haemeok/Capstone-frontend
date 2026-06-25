"use client";

import { useFormContext, UseFormRegister, useWatch } from "react-hook-form";

import { ChefHat, X } from "lucide-react";

import { INGREDIENT_IMAGE_URL } from "@/shared/config/constants/recipe";
import { format, useRecipeFormDict } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import { syncStepIngredientUnit } from "../lib/syncStepIngredientUnit";
import { RecipeFormValues } from "../model/config";
import UnitSelect from "./UnitSelect";

type IngredientItemProps = {
  field: {
    id: string;
    ingredientId: string;
    name: string;
    unit: string;
  };
  index: number;
  onRemove: (index: number) => void;
  register: UseFormRegister<RecipeFormValues>;
  error?: { message?: string };
};

const IngredientItem = ({
  field,
  index,
  onRemove,
  register,
  error,
}: IngredientItemProps) => {
  const { control, setValue, getValues } = useFormContext<RecipeFormValues>();
  const { ui } = useRecipeFormDict();
  const quantity = useWatch({
    control,
    name: `ingredients.${index}.quantity`,
  });
  const unit = useWatch({
    control,
    name: `ingredients.${index}.unit`,
  });

  const isApproximate = quantity === "약간";

  const toggleApproximate = () => {
    if (isApproximate) {
      setValue(`ingredients.${index}.quantity`, "", { shouldValidate: true });
    } else {
      setValue(`ingredients.${index}.quantity`, "약간", {
        shouldValidate: true,
      });
    }
  };

  const handleUnitChange = (nextUnit: string) => {
    setValue(`ingredients.${index}.unit`, nextUnit, { shouldValidate: true });
    const currentSteps = getValues("steps");
    setValue(
      "steps",
      syncStepIngredientUnit(currentSteps, field.name, nextUnit),
      { shouldDirty: true }
    );
  };

  return (
    <div className="flex min-h-16 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-full flex-1 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            {field.ingredientId ? (
              <Image
                src={INGREDIENT_IMAGE_URL(field.name)}
                alt={field.name}
                wrapperClassName="h-full w-full rounded-lg"
                fit="cover"
                lazy={false}
                width={40}
                height={40}
                errorFallback={
                  <ChefHat
                    className="text-olive-light/60 h-5 w-5"
                    aria-hidden
                  />
                }
              />
            ) : (
              <ChefHat className="text-olive-light/60 h-5 w-5" aria-hidden />
            )}
          </div>
          <p className="text-ink flex-1 font-medium">{field.name}</p>

          <button
            type="button"
            onClick={toggleApproximate}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              isApproximate
                ? "bg-olive-light text-white"
                : "text-ink-sub border border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            {ui.unitlessSlight}
          </button>

          {isApproximate ? (
            <span className="w-12 rounded border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm text-gray-400">
              {ui.unitlessSlight}
            </span>
          ) : (
            <input
              type="text"
              className={`w-12 rounded border px-2 py-1 text-right text-sm focus:border-green-500 focus:outline-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              {...register(`ingredients.${index}.quantity`, {
                required: ui.quantityUnitRequired,
              })}
            />
          )}
          {field.ingredientId ? (
            <UnitSelect
              ingredientId={field.ingredientId}
              value={unit}
              onChange={handleUnitChange}
              disabled={isApproximate}
              ariaLabel={format(ui.unitSelectAria, { name: field.name })}
            />
          ) : (
            <input
              type="text"
              value={unit}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={isApproximate}
              placeholder={ui.unitPlaceholder}
              aria-label={format(ui.unitSelectAria, { name: field.name })}
              className="text-ink h-8 w-20 rounded border border-gray-300 px-2 text-sm focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          )}
        </div>
        <div className="flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
            onClick={() => onRemove(index)}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
      {error && !isApproximate && (
        <p className="w-full text-right text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default IngredientItem;
