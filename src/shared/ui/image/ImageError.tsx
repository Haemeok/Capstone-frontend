import { cn } from "@/shared/lib/utils";

type ImageErrorProps = {
  message?: string;
  className?: string;
};

const ImageError = ({ message, className }: ImageErrorProps) => (
  <div 
    className={cn(
      "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
      className
    )}
    role="img"
    aria-label={message || "이미지 로드 실패"}
  >
    <img 
      src="/noImage.png" 
      alt="이미지 로드 실패" 
      className="w-full h-full object-cover"
    />
  </div>
);

export default ImageError;
