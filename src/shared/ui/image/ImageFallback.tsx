import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type ImageFallbackProps = {
  className?: string;
};

const ImageFallback = ({ className }: ImageFallbackProps) => (
  <Skeleton 
    className={cn(
      "opacity-100 transition-opacity duration-300 ease-in-out",
      className
    )}
  />
);

export default ImageFallback;