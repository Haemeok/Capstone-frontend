import { Suspense } from "react";
import Image from "./Image";
import DefaultImageFallback from "./DefaultImageFallback";

type SuspenseImageProps = {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  errorMessage?: string;
  suspenseFallback?: React.ReactNode;
  [key: string]: any;
};

const SuspenseImage = ({
  src,
  alt,
  fallback,
  errorFallback,
  errorMessage,
  suspenseFallback,
  ...props
}: SuspenseImageProps) => {
  return (
    <Suspense fallback={suspenseFallback || <DefaultImageFallback />}>
      <Image
        src={src}
        alt={alt}
        fallback={fallback}
        errorFallback={errorFallback}
        errorMessage={errorMessage}
        {...props}
      />
    </Suspense>
  );
};

export default SuspenseImage;
