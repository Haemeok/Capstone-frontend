import { Image } from "@/shared/ui/image";

type RecipeThumbProps = {
  src: string;
  alt: string;
};

export const RecipeThumb = ({ src, alt }: RecipeThumbProps) => (
  <Image
    src={src}
    alt={alt}
    lazy
    aspectRatio="1 / 1"
    wrapperClassName="rounded-lg"
  />
);
