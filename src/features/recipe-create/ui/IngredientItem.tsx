"use client";

import { UseFormRegister, useFormContext, useWatch } from "react-hook-form";

import { X } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import { Image } from "@/shared/ui/image/Image";

import { RecipeFormValues } from "../model/config";
import { INGREDIENT_IMAGE_URL } from "@/shared/config/constants/recipe";

type IngredientItemProps = {
  field: { id: string; name: string; unit: string };
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
  const { control, setValue } = useFormContext<RecipeFormValues>();
  const quantity = useWatch({
    control,
    name: `ingredients.${index}.quantity`,
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

  return (
    <div className="flex min-h-16 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-full flex-1 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Image
              src={INGREDIENT_IMAGE_URL(field.name)}
              alt={field.name}
              wrapperClassName="h-full w-full rounded-lg"
              fit="cover"
              width={40}
              height={40}
            />
          </div>
          <p className="flex-1 font-medium text-gray-800">{field.name}</p>

          <button
            type="button"
            onClick={toggleApproximate}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              isApproximate
                ? "bg-olive-light text-white"
                : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            약간
          </button>

          <input
            type="text"
            disabled={isApproximate}
            className={`w-12 rounded border px-2 py-1 text-right text-sm focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            {...register(`ingredients.${index}.quantity`, {
              required: "수량/단위를 입력해주세요.",
            })}
          />
          <p className="w-8 text-sm text-gray-500">{field.unit}</p>
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
