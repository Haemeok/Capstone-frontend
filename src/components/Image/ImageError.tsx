import { cn } from '@/lib/utils';

type ImageErrorProps = {
  message: string;
  className: string;
};

const ImageError = ({ message, className }: ImageErrorProps) => (
  <img
    src={'/noImage.png'}
    alt="이미지 로드 실패"
    className={cn(className, 'h-full w-full object-cover')}
  />
);

export default ImageError;
