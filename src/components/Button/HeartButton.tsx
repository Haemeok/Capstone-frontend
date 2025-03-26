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
        activeIcon={<Heart className="w-10 h-10 text-red-700 fill-red-700" />}
        className="w-[100px] h-[100px] flex items-center justify-center border-2 rounded-full p-2"
      />
      <span className="mt-2">{likes}</span>
    </div>
  );
};

export default HeartButton;
