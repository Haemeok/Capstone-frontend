import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
};

const PrevButton = ({ className, onClick }: PrevButtonProps) => {
  const navigate = useNavigate();
  return (
    <button className={className} onClick={onClick ?? (() => navigate(-1))}>
      <ArrowLeftIcon size={24} />
    </button>
  );
};

export default PrevButton;
