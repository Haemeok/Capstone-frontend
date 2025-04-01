import { User } from "@/type/user";
import { Avatar } from "./ui/avatar";

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="w-full max-w-md overflow-hidden h-[80px]">
      <div className="flex gap-2 h-full items-center">
        <Avatar className="h-full w-[80px] border-2">
          <img src={user.imageURL} alt={user.name} className="object-cover" />
        </Avatar>
        <div className="h-full p-2">
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-sm text-left">{user.profileContent}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
