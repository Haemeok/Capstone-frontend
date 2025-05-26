import { useImageLoader } from '@/hooks/useImageLoader';
import ImageError from './ImageError';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type ImageProps = {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  errorMessage?: string;
  className?: string;
  loadingClassName?: string;
  errorClassName?: string;
  ref?: React.Ref<HTMLImageElement>;
  blackOverlay?: boolean;
  [key: string]: any;
};
const Image = ({
  src,
  alt = '이미지',
  fallback,
  errorFallback,
  errorMessage = '',
  className = '',
  loadingClassName = '',
  errorClassName = '',
  blackOverlay = false,
  ref,
  ...imgProps
}: ImageProps) => {
  const { loaded, error, loading } = useImageLoader(src);

  if (error) {
    return (
      errorFallback || (
        <ImageError
          message={errorMessage}
          className={errorClassName || className}
        />
      )
    );
  }

  return loaded ? (
    <img
      src={src}
      alt={alt}
      className={cn(
        `${loaded ? 'opacity-100' : 'opacity-0'}`,
        'transition-opacity duration-300 ease-in-out',
        className,
      )}
      {...imgProps}
      ref={ref}
    />
  ) : (
    fallback || (
      <Skeleton
        className={cn(
          `${loaded ? 'opacity-0' : 'opacity-100'}`,
          'transition-opacity duration-300 ease-in-out',
          className,
        )}
      />
    )
  );
};

export default Image;
