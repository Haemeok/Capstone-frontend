import { useImageLoader } from "@/shared/hooks/useImageLoader";
import ImageError from "@/shared/ui/image/ImageError";
import ImageFallback from "@/shared/ui/image/ImageFallback";
import { cn } from "@/shared/lib/utils";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  errorMessage?: string;
  loadingClassName?: string;
  errorClassName?: string;
  ref?: React.Ref<HTMLImageElement>;
};

export const Image = ({
  src,
  alt = "이미지",
  fallback,
  errorFallback,
  errorMessage,
  className,
  loadingClassName,
  errorClassName,
  ref,
  ...imgProps
}: ImageProps) => {
  const { isLoading, isLoaded, hasError } = useImageLoader(src);

  if (hasError) {
    return (
      errorFallback || (
        <ImageError
          message={errorMessage}
          className={cn(errorClassName, className)}
        />
      )
    );
  }

  if (isLoading) {
    return (
      fallback || (
        <ImageFallback className={cn(loadingClassName, className)} />
      )
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(
        "opacity-0 transition-opacity duration-300 ease-in-out",
        isLoaded && "opacity-100",
        className
      )}
      {...imgProps}
    />
  );
};
