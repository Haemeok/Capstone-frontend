import { Avatar } from '@radix-ui/react-avatar';
import React from 'react';
import { useNavigate } from 'react-router';
import SuspenseImage from './Image/SuspenseImage';
import { cn } from '@/lib/utils';

type UserProfileImageProps = {
  profileImage: string;
  userId: number;
  className?: string;
};

const UserProfileImage = ({
  profileImage,
  userId,
  className,
}: UserProfileImageProps) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/users/${userId}`);
  };
  return (
    <Avatar
      className={cn('h-8 w-8 rounded-full', className)}
      onClick={handleClick}
    >
      <SuspenseImage
        src={profileImage}
        alt="profileImage"
        className="h-full w-full rounded-full object-cover"
      />
    </Avatar>
  );
};

export default UserProfileImage;
