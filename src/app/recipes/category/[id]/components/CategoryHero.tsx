import {
  CATEGORY_BASE_URL,
  type TagCode,
  TAGS_BY_CODE,
  TAGS_IMAGE_KEYS,
} from "@/shared/config/constants/recipe";
import PrevButton from "@/shared/ui/PrevButton";

type CategoryHeroProps = {
  tagCode: TagCode;
};

const CategoryHero = ({ tagCode }: CategoryHeroProps) => {
  const tagDef = TAGS_BY_CODE[tagCode];
  const tagName = tagDef?.name ?? String(tagCode);
  const imageKey = TAGS_IMAGE_KEYS[tagCode];
  const imageUrl = imageKey ? `${CATEGORY_BASE_URL}${imageKey}` : undefined;

  return (
    <section className="relative h-[150px] w-full overflow-hidden bg-gray-100">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={tagName}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      <PrevButton className="absolute top-3 left-3 z-10 text-white" />

      <div className="absolute bottom-3.5 left-4 z-10 flex items-center gap-2">
        {tagDef?.emoji && <span className="text-2xl">{tagDef.emoji}</span>}
        <h1 className="text-2xl font-bold text-white drop-shadow-sm">
          {tagName}
        </h1>
      </div>
    </section>
  );
};

export default CategoryHero;
