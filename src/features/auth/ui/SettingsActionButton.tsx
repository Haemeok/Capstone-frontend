"use client";

import { useState } from "react";

import { LogOut, Settings, BookOpen } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";

import IOSInstallGuideModal from "@/widgets/IOSInstallGuideModal";

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const { Container, Content, Header, Title, Footer, Close } =
    useResponsiveSheet();

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  const handleGuideClick = () => {
    setIsModalOpen(false);
    setIsGuideModalOpen(true);
  };

  const isInstalled =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true);

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

            {!isInstalled && (
              <div className="border-t border-gray-200 p-4 sm:border-none">
                <div className="border-olive-mint bg-olive-mint/5 relative rounded-lg border-2 p-4">
                  <div className="bg-brown/80 text-beige absolute -top-3 right-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                    🎁 AI 레시피 매일 1회 무료!
                  </div>
                  <button
                    onClick={handleGuideClick}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-olive-mint flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white">
                        <BookOpen size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          레시피오 앱 설치 가이드
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          홈 화면에 추가하고 더 빠르게 사용하세요
                        </p>
                      </div>
                      <div className="text-gray-400">›</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

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

      <IOSInstallGuideModal
        isOpen={isGuideModalOpen}
        onOpenChange={setIsGuideModalOpen}
      />
    </>
  );
};

export default SettingsActionButton;
