import { END_POINTS } from "@/constants/api";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

type CateGoryItemProps = {
  id: number;
  name: string;
  imageUrl: string;
  onClick: () => void;
  className?: string;
};

const CateGoryItem = ({
  name,
  imageUrl,
  onClick,
  className,
}: CateGoryItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "flex-shrink-0 w-50 h-70 rounded-lg overflow-hidden relative shadow-md cursor-pointer",
        className
      )}
      onClick={() => {
        navigate(END_POINTS.RECIPES_BY_CATEGORY(name));
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-50 h-70 object-cover img-smooth"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white text-sm font-semibold truncate">{name}</h3>
      </div>
    </div>
  );
};

export default CateGoryItem;
