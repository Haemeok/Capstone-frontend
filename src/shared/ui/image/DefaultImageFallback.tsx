import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type DefaultImageFallbackProps = {
  className?: string;
};

const DefaultImageFallback = ({ className }: DefaultImageFallbackProps) => {
  return <Skeleton className={className} />;
};

export default DefaultImageFallback;
