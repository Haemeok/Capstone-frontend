import { Edit } from 'lucide-react';

import { useNavigate } from 'react-router';

type UserInfoEditButtonProps = {
  nickname: string;
  description: string;
  profileImageUrl: string;
};

const UserInfoEditButton = ({
  nickname,
  description,
  profileImageUrl,
}: UserInfoEditButtonProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate('/user/info', {
          state: { userData: { nickname, description, profileImageUrl } },
        })
      }
      className="bg-olive-light absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md"
    >
      <Edit size={14} className="text-white" />
    </div>
  );
};

export default UserInfoEditButton;
