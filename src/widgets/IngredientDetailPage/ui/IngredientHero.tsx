import { Image } from "@/shared/ui/image/Image";

type IngredientHeroProps = {
  name: string;
  categoryLabel: string;
  imageUrl?: string;
};

const IngredientHero = ({ name, categoryLabel, imageUrl }: IngredientHeroProps) => {
  return (
    <div className="flex flex-col items-center py-8 gap-3">
      <div className="w-24 h-24 rounded-2xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl ?? ""}
          alt={name}
          width={64}
          height={64}
          aspectRatio="1 / 1"
          fit="contain"
          wrapperClassName="rounded-lg"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-sm text-gray-500">{categoryLabel}</p>
      </div>
    </div>
  );
};

export default IngredientHero;
