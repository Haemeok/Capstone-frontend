import { Button } from '@/components/ui/button';
import { LogIn, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

type ActionButtonProps = {
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  isGuest: boolean;
};

const ActionButton = ({
  isLoggedIn,
  isOwnProfile,
  isGuest,
}: ActionButtonProps) => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateRecipeClick = () => {
    navigate('/recipes/new');
  };

  if (!isOwnProfile && !isGuest) {
    return <></>;
  }

  if (!isLoggedIn && isGuest) {
    return (
      <Button
        className="bg-olive-medium hover:bg-olive-dark rounded-full px-6 text-white"
        onClick={handleLoginClick}
      >
        <LogIn size={16} className="mr-1" /> 로그인
      </Button>
    );
  }

  return (
    <Button
      className="bg-olive-light gap-0 rounded-full px-6 text-white"
      onClick={handleCreateRecipeClick}
    >
      <Plus size={16} className="mr-1" /> 레시피 등록하기
    </Button>
  );
};

export default ActionButton;
