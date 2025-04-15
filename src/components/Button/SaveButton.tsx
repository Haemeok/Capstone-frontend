import { useState } from 'react';
import { Bookmark } from 'lucide-react';

type SaveButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
};

const SaveButton = ({ className, onClick, label }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (active: boolean) => {
    setIsSaved(active);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleToggle(!isSaved)}
        className={`h-14 w-14 ${className}`}
      >
        <Bookmark
          width={24}
          height={24}
          className={`transition-all duration-300 ${
            isSaved ? 'fill-zinc-800' : ''
          } `}
        />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default SaveButton;
