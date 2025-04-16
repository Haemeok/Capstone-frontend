import { Skeleton } from '../ui/skeleton';

type DefaultImageFallbackProps = {
  className?: string;
};

const DefaultImageFallback = ({ className }: DefaultImageFallbackProps) => {
  return <Skeleton className={className} />;
};

export default DefaultImageFallback;
