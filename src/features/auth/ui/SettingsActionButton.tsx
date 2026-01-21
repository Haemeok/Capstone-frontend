"use client";

import { useState } from "react";

import { LogOut, Settings, FileText, AlertTriangle } from "lucide-react";

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

            <div className="flex flex-col border-t border-gray-200 sm:border-none">
              <a
                href="https://grizzly-taker-1ad.notion.site/2ecc8d1def7c8068ad97e3f6318b6d90?pvs=74"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FileText size={16} aria-hidden="true" />
                <span>개인정보처리방침</span>
              </a>
              <a
                href="https://slashpage.com/recipio/n5w9812gwype424kpgze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span aria-hidden="true">💬</span>
                <span>사용후기</span>
              </a>
              <a
                href="https://slashpage.com/recipio/943zqpmqxn63g2wnvy87"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span aria-hidden="true">🐛</span>
                <span>오류제보</span>
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdVUjr7LsnvG-WVG46cBhQOOUJN82irzTaKVS2Uthl6qKZgVg/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <AlertTriangle size={16} aria-hidden="true" />
                <span>저작권 신고 및 게시 중단 요청</span>
              </a>
            </div>

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
