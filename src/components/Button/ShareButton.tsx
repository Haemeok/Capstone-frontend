import { useNavigate } from 'react-router';
import { Share2 } from 'lucide-react';
import clsx from 'clsx';

type ShareButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
};

const ShareButton = ({
  className,
  onClick,
  label,
  ...props
}: ShareButtonProps) => {
  const navigate = useNavigate();
  const finalButtonClassName = clsx(
    'nav-button-base',
    'flex h-10 w-10 items-center justify-center',
    className,
  );
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick ?? (() => navigate('/recipes'))}
        className={finalButtonClassName}
        {...props}
      >
        <Share2 width={24} height={24} />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default ShareButton;
