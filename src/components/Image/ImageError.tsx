import { NO_IMAGE_URL } from '@/constants/user';

type ImageErrorProps = {
  message: string;
  className: string;
};

const ImageError = ({ message, className }: ImageErrorProps) => (
  <img src={NO_IMAGE_URL} alt="이미지 로드 실패" className={className} />
);

export default ImageError;
