import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

type TopNavBarProps = {
  label: string;
  isActivePrevButton: boolean;
};
const TopNavBar = ({ label, isActivePrevButton }: TopNavBarProps) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 right-0 left-0 z-10 flex h-16 w-full bg-white">
      <div className="flex w-full items-center justify-between gap-2 p-4">
        {isActivePrevButton && (
          <>
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon size={24} />
            </button>
            <span className="text-lg font-semibold">{label}</span>
          </>
        )}
        <p></p>
      </div>
    </div>
  );
};

export default TopNavBar;
