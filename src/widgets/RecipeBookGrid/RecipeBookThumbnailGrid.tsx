import type { BookRecipe } from "@/entities/recipe-book";
import { Image } from "@/shared/ui/image/Image";

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
            <Image
              key={recipe.recipeId}
              src={recipe.imageUrl}
              alt={recipe.title}
              fit="cover"
              wrapperClassName="h-full w-full rounded-lg bg-gray-50 shadow-sm"
            />
          );
        })}
      </div>
    </div>
  );
};
