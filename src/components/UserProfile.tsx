import { User } from '@/type/user';
import { Avatar } from './ui/avatar';

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="h-[80px] w-full max-w-md overflow-hidden">
      <div className="flex h-full items-center gap-2">
        <Avatar className="h-full w-[80px] border-2">
          <img
            src={user.profileImage}
            alt={user.nickname}
            className="object-cover"
          />
        </Avatar>
        <div className="h-full p-2">
          <h3 className="text-lg font-bold">{user.nickname}</h3>
          <p className="text-left text-sm">{user.profileContent}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
