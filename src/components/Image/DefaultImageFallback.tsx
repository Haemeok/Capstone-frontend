type DefaultImageFallbackProps = {
  className?: string;
};

const DefaultImageFallback = ({ className }: DefaultImageFallbackProps) => (
  <div className={`image-loading-fallback ${className || ""}`}>
    <div className="loading-spinner"></div>
    <p>이미지 로딩 중...</p>
  </div>
);

export default DefaultImageFallback;
