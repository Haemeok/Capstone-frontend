"use client";

import { useState } from "react";
import Link from "next/link";

import { LogOut, Settings, FileText, AlertTriangle, UserX, Bell } from "lucide-react";

import { isAppWebView, requestNotificationPermission } from "@/shared/lib/bridge";
import { useNotificationPermissionStore } from "@/features/notification-permission";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import useDeleteAccountMutation from "@/features/auth/model/hooks/useDeleteAccountMutation";
import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteAccountMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  const isInApp = isAppWebView();
  const notificationStatus = useNotificationPermissionStore((state) => state.status);
  const [isNotificationOn, setIsNotificationOn] = useState(notificationStatus === "granted");

  const handleNotificationToggle = () => {
    if (!isNotificationOn) {
      requestNotificationPermission();
    }
    setIsNotificationOn(!isNotificationOn);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(false);
    logout();
  };

  const handleWithdrawClick = () => {
    setIsWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = () => {
    setIsWithdrawDialogOpen(false);
    setIsModalOpen(false);
    deleteAccount();
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
              <Description className="sr-only">앱 설정 및 계정 관리</Description>
            </Header>

            <div className="flex flex-col border-t border-gray-200 sm:border-none">
              {isInApp && (
                <div className="flex w-full items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bell size={16} aria-hidden="true" />
                    <span>알림</span>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                      isNotificationOn ? "bg-green-500" : "bg-gray-300"
                    }`}
                    aria-label={isNotificationOn ? "알림 끄기" : "알림 켜기"}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isNotificationOn ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              )}
              <Link
                href="/privacy"
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FileText size={16} aria-hidden="true" />
                <span>개인정보처리방침</span>
              </Link>
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
              <button
                onClick={handleWithdrawClick}
                disabled={isDeleting}
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserX size={16} aria-hidden="true" />
                <span>회원탈퇴</span>
              </button>
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

      <DeleteModal
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴 후에는 계정을 복구할 수 없습니다."
        onConfirm={handleWithdrawConfirm}
        cancelLabel="취소"
        confirmLabel={isDeleting ? "삭제 중..." : "탈퇴하기"}
      />
    </>
  );
};

export default SettingsActionButton;
