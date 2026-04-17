import Image from "next/image";

import type { BookRecipe } from "@/entities/recipe-book";

type Props = {
  recipes: BookRecipe[];
};

const SLOT_COUNT = 4;

export const RecipeBookThumbnailGrid = ({ recipes }: Props) => {
  const slots = Array.from({ length: SLOT_COUNT });
  return (
    <div className="aspect-square w-full rounded-2xl bg-beige p-3 shadow-sm">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
        {slots.map((_, idx) => {
          const recipe = recipes[idx];
          if (!recipe) {
            return <div key={idx} className="rounded-lg" aria-hidden />;
          }
          return (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-lg bg-gray-50 shadow-sm"
            >
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
