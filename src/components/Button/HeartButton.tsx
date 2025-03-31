import { useState } from "react";
import ToggleIconButton from "./ToggleIconButton";
import { Heart } from "lucide-react";

const HeartButton = () => {
  const [likes, setLikes] = useState(5);
  const [isLiked, setIsLiked] = useState(false);

  const handleToggle = (active: boolean) => {
    setIsLiked(active);
    setLikes((prev) => (active ? prev + 1 : prev - 1));
  };

  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        isActive={isLiked}
        onToggle={handleToggle}
        icon={<Heart width={24} height={24} />}
        activeIcon={<Heart className="text-red-700 fill-red-700" />}
        className="w-16 h-16 flex items-center justify-center border-2 rounded-full p-2"
      />
      <span className="mt-1 text-sm font-bold">{likes}</span>
    </div>
  );
};

export default HeartButton;
