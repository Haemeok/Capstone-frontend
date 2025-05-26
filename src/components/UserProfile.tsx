import { User } from '@/type/user';
import UserProfileImage from './UserProfileImage';
import Username from './Username';
interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="h-[80px] w-full max-w-md overflow-hidden">
      <div className="flex h-full items-center gap-2">
        <UserProfileImage
          profileImage={user.profileImage ?? ''}
          userId={user.id}
          className="h-full w-[80px]"
        />
        <div className="h-full p-2">
          <Username username={user.nickname} userId={user.id} />
          <p className="text-left text-sm">{user.profileContent}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
