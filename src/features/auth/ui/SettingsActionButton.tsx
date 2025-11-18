"use client";

import { useState } from "react";

import { LogOut, Settings } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Container, Content, Header, Title, Footer, Close } =
    useResponsiveSheet();

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="설정"
        className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
      >
        <Settings size={20} aria-hidden="true" />
      </button>
      {isModalOpen && (
        <Container open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Content className="p-0 sm:p-6 md:max-w-sm">
            <Header>
              <Title className="text-lg">설정</Title>
            </Header>
            <Footer className="flex-col gap-0 p-0 sm:flex-row sm:justify-end sm:gap-2">
              <button
                onClick={handleLogoutClick}
                aria-label="로그아웃"
                className="flex w-full cursor-pointer items-center justify-center gap-1 border-t border-gray-200 px-4 py-3 font-bold text-red-500 sm:w-auto sm:rounded-md sm:border-none sm:bg-red-50 sm:py-2 sm:hover:bg-red-100"
              >
                <LogOut size={16} aria-hidden="true" className="mr-1" />
                <span>로그아웃</span>
              </button>
              {Close ? (
                <Close asChild>
                  <button className="w-full cursor-pointer border-t border-gray-200 px-4 py-3 font-bold text-gray-800 sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:py-2 sm:hover:bg-gray-50">
                    닫기
                  </button>
                </Close>
              ) : (
                <button
                  className="w-full cursor-pointer border-t border-gray-200 px-4 py-3 font-bold text-gray-800 sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:py-2 sm:hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  닫기
                </button>
              )}
            </Footer>
          </Content>
        </Container>
      )}
    </>
  );
};

export default SettingsActionButton;
