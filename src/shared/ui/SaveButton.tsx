import { Bookmark } from "lucide-react";

type SaveButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
  isFavorite: boolean;
};

const SaveButton = ({
  className,
  onClick,
  label,
  isFavorite,
}: SaveButtonProps) => {
  return (
    <div className="flex flex-col items-center">
      <button onClick={onClick} className={`h-14 w-14 ${className}`}>
        <Bookmark
          width={24}
          height={24}
          className={`transition-all duration-300 ${
            isFavorite ? "fill-dark" : ""
          } `}
        />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default SaveButton;
