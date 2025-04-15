type ImageErrorProps = {
  message: string;
  className: string;
};

const ImageError = ({ message, className }: ImageErrorProps) => (
  <div className={`image-error ${className || ''}`}>
    {message || '이미지를 불러올 수 없습니다'}
  </div>
);

export default ImageError;
