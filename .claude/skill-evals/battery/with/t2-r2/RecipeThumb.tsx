import { Image } from "@/shared/ui/image/Image";

type RecipeThumbProps = {
  src: string;
  alt: string;
};

export const RecipeThumb = ({ src, alt }: RecipeThumbProps) => (
  <Image
    src={src}
    alt={alt}
    aspectRatio="1 / 1"
    wrapperClassName="rounded-lg"
  />
);
