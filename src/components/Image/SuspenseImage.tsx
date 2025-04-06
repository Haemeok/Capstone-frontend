import { Suspense } from "react";
import Image from "./Image";
import DefaultImageFallback from "./DefaultImageFallback";
import { circIn } from "framer-motion";

type SuspenseImageProps = {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  ref?: React.Ref<HTMLImageElement>;
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
  ref,
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
        ref={ref}
        {...props}
      />
    </Suspense>
  );
};

export default SuspenseImage;
