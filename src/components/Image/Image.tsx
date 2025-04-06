import { useImageLoader } from "@/hooks/useImageLoader";
import ImageError from "./ImageError";
import DefaultImageFallback from "./DefaultImageFallback";

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
  alt = "이미지",
  fallback,
  errorFallback,
  errorMessage = "",
  className = "",
  loadingClassName = "",
  errorClassName = "",
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
    return fallback || <DefaultImageFallback className={loadingClassName} />;
  }

  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className={className} {...imgProps} ref={ref} />
      {blackOverlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      )}
    </div>
  );
};

export default Image;
