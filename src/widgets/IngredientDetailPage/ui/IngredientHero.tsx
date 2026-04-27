import { Image } from "@/shared/ui/image/Image";

type IngredientHeroProps = {
  name: string;
  categoryLabel: string | null;
  imageUrl: string | null;
  shortDescription: string | null;
  caloriesPer100g: number | null;
};

const IngredientHero = ({
  name,
  categoryLabel,
  imageUrl,
  shortDescription,
  caloriesPer100g,
}: IngredientHeroProps) => {
  const metaPieces: string[] = [];
  if (categoryLabel) metaPieces.push(categoryLabel);
  if (caloriesPer100g !== null) {
    metaPieces.push(`${caloriesPer100g}kcal/100g`);
  }
  const metaLine = metaPieces.join(" · ");

  return (
    <div className="flex flex-col items-center pt-6 pb-6 gap-3 px-5">
      <div className="w-40 h-40 rounded-3xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl ?? ""}
          alt={name}
          width={128}
          height={128}
          aspectRatio="1 / 1"
          fit="contain"
          wrapperClassName="rounded-2xl"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {metaLine && (
          <p className="text-sm text-gray-500">{metaLine}</p>
        )}
        {shortDescription && (
          <p className="text-sm text-gray-600 text-center mt-1 leading-relaxed">
            {shortDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default IngredientHero;
