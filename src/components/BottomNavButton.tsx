import React from 'react';
import { useLocation, useNavigate } from 'react-router';

type BottomNavButtonProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const BottomNavButton = ({ icon, label, path }: BottomNavButtonProps) => {
  const navigate = useNavigate();
  const currentPath = useLocation();
  return (
    <button
      className={`flex cursor-pointer flex-col items-center ${
        currentPath.pathname === path ? 'text-olive' : 'text-gray-400'
      }`}
      onClick={() => navigate(path)}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};

export default BottomNavButton;
