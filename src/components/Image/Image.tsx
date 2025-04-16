import { useImageLoader } from '@/hooks/useImageLoader';
import ImageError from './ImageError';
import DefaultImageFallback from './DefaultImageFallback';
import { Skeleton } from '../ui/skeleton';

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
        <ImageError message={errorMessage} className={errorClassName} />
      )
    );
  }

  if (loading) {
    return fallback || <Skeleton className={className} />;
  }

  return (
    <img src={src} alt={alt} className={className} {...imgProps} ref={ref} />
  );
};

export default Image;
