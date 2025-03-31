import { useState } from "react";
import ToggleIconButton from "./ToggleIconButton";
import { Bookmark } from "lucide-react";

const SaveButton = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (active: boolean) => {
    setIsSaved(active);
  };

  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        isActive={isSaved}
        onToggle={handleToggle}
        size="default"
        icon={<Bookmark width={24} height={24} />}
        activeIcon={<Bookmark className="fill-zinc-800" />}
        className="w-16 h-16 flex items-center justify-center border-2 rounded-full p-2"
      />
      <p className="font-bold text-sm mt-1">저장</p>
    </div>
  );
};

export default SaveButton;
