import { useState } from 'react';

import { LogOut,Settings } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import useLogoutMutation from '@/hooks/useLogoutMutation';

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        <Settings size={20} className="mr-1" />
      </button>
      {isModalOpen && (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle className="text-lg">설정</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter className="gap-0">
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center gap-1 border-t-1 border-gray-200 px-4 py-2 font-semibold text-red-500"
              >
                <LogOut size={16} className="mr-1" />
                <p>로그아웃</p>
              </button>
              <DrawerClose asChild>
                <button className="text-dark rounded-md border-t-1 border-gray-200 px-4 py-2 font-semibold">
                  닫기
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SettingsActionButton;
