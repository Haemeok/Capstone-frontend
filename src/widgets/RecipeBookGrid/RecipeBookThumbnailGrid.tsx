import { Image } from "@/shared/ui/image/Image";

import type { BookRecipe } from "@/entities/recipe-book";

type Props = {
  recipes: BookRecipe[];
};

const SLOT_COUNT = 4;

export const RecipeBookThumbnailGrid = ({ recipes }: Props) => {
  const slots = Array.from({ length: SLOT_COUNT });
  return (
    <div className="rounded-card bg-beige aspect-square w-full p-3 shadow-sm">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
        {slots.map((_, idx) => {
          const recipe = recipes[idx];
          if (!recipe) {
            return <div key={idx} className="rounded-card" aria-hidden />;
          }
          return (
            <Image
              key={recipe.recipeId}
              src={recipe.imageUrl}
              alt={recipe.title}
              fit="cover"
              wrapperClassName="h-full w-full rounded-card bg-gray-50 shadow-sm"
            />
          );
        })}
      </div>
    </div>
  );
};
