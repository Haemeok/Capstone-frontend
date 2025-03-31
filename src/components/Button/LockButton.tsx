import { useState } from "react";
import ToggleIconButton from "./ToggleIconButton";
import { LockKeyhole, LockOpen } from "lucide-react";

const LockButton = () => {
  const [isLocked, setIsLocked] = useState(false);

  const handleToggle = (active: boolean) => {
    setIsLocked(active);
  };

  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        isActive={isLocked}
        onToggle={handleToggle}
        size="default"
        icon={
          <LockOpen
            width={24}
            height={24}
            className="transition-all duration-300"
          />
        }
        activeIcon={<LockKeyhole className="transition-all duration-300" />}
        className="w-16 h-16 flex items-center justify-center border-2 rounded-full p-2"
      />
      <p className="text-sm font-bold mt-1">{isLocked ? "비공개" : "공개"}</p>
    </div>
  );
};

export default LockButton;
