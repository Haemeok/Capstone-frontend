import { useNavigate } from "react-router";
import ToggleIconButton from "./ToggleIconButton";
import { Share2 } from "lucide-react";

const ShareButton = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        onClick={() => navigate("/recipes")}
        icon={<Share2 width={24} height={24} />}
        activeIcon={<Share2 className="fill-zinc-800" />}
        className="w-16 h-16 flex items-center justify-center border-2 rounded-full p-2"
      />
      <p className="text-sm font-bold mt-1">공유</p>
    </div>
  );
};

export default ShareButton;
