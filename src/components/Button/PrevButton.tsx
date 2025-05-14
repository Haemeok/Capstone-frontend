import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: number;
};

const PrevButton = ({ className, onClick, size = 24 }: PrevButtonProps) => {
  const navigate = useNavigate();
  return (
    <button className={className} onClick={onClick ?? (() => navigate(-1))}>
      <ArrowLeftIcon size={size} />
    </button>
  );
};

export default PrevButton;
