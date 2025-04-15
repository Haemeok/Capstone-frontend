import { useNavigate } from 'react-router';
import { Share2 } from 'lucide-react';

type ShareButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
  ariaLabel?: string;
};

const ShareButton = ({
  className,
  onClick,
  label,
  ariaLabel,
}: ShareButtonProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick ?? (() => navigate('/recipes'))}
        className={`flex h-10 w-10 items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        <Share2 width={24} height={24} />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default ShareButton;
