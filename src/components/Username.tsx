import React from 'react';
import { useNavigate } from 'react-router';

type UsernameProps = {
  username: string;
  userId: number;
};

const Username = ({ username, userId }: UsernameProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/users/${userId}`);
  };
  return (
    <button onClick={handleClick}>
      <p className="text-sm font-bold text-gray-800">{username}</p>
    </button>
  );
};

export default Username;
