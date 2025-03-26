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

  return <img src={src} alt={alt} className={className} {...imgProps} />;
};

export default Image;
