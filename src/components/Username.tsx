import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

type UsernameProps = {
  username: string;
  userId: number;
  className?: string;
};

const Username = ({ username, userId, className }: UsernameProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/users/${userId}`);
  };
  return (
    <button onClick={handleClick}>
      <p className={cn('text-sm font-bold text-gray-800', className)}>
        {username}
      </p>
    </button>
  );
};

export default Username;
