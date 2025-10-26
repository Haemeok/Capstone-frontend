"use client";

import { useState } from "react";

import { LogOut, Settings } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="설정"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Settings size={20} aria-hidden="true" />
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
                aria-label="로그아웃"
                className="flex items-center justify-center gap-1 border-t-1 border-gray-200 px-4 py-2 font-bold text-red-500"
              >
                <LogOut size={16} aria-hidden="true" className="mr-1" />
                <span>로그아웃</span>
              </button>
              <DrawerClose asChild>
                <button className="text-dark rounded-md border-t-1 border-gray-200 px-4 py-2 font-bold">
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
