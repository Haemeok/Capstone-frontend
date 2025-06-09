import React from 'react';
import SettingsActionButton from './SettingsActionButton';
import PrevButton from '@/components/Button/PrevButton';

type HeaderProps = {
  isOwnProfile: boolean;
};

const Header = ({ isOwnProfile }: HeaderProps) => {
  if (isOwnProfile) {
    return (
      <div className="z-30 flex justify-between bg-white p-4">
        <h2 className="text-2xl font-bold">프로필</h2>
        <SettingsActionButton />
      </div>
    );
  }

  return (
    <div className="z-30 flex gap-4 bg-white p-4">
      <PrevButton />
      <h2 className="text-2xl font-bold">프로필</h2>
    </div>
  );
};

export default Header;
