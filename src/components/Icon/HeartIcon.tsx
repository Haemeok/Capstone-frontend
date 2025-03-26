import { Heart } from "lucide-react";

type HeartIconProps = {
  className?: string;
};

const HeartIcon = ({ className = "" }: HeartIconProps) => {
  return <Heart width={24} height={24} className={className} />;
};

export default HeartIcon;
