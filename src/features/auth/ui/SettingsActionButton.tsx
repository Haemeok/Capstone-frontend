"use client";

import { useState } from "react";

import { LogOut, Settings, FileText, AlertTriangle, UserX, Bell } from "lucide-react";

import { useUserStore } from "@/entities/user";
import { isAppWebView, requestNotificationPermission } from "@/shared/lib/bridge";
import { useNotificationPermissionStore } from "@/features/notification-permission";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";

const WITHDRAW_ALLOWED_USER_ID = "lBg4xR1e";

const SettingsActionButton = () => {
  const { mutate: logout } = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const { Container, Content, Header, Title, Footer, Close } =
    useResponsiveSheet();

  const isInApp = isAppWebView();
  const canWithdraw = user?.id === WITHDRAW_ALLOWED_USER_ID;
  const notificationStatus = useNotificationPermissionStore((state) => state.status);
  const isNotificationEnabled = notificationStatus === "granted";

  const handleNotificationToggle = () => {
    if (!isNotificationEnabled) {
      requestNotificationPermission();
    }
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
              {isInApp && (
                <div className="flex w-full items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bell size={16} aria-hidden="true" />
                    <span>알림</span>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    disabled={isNotificationEnabled}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      isNotificationEnabled
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } ${isNotificationEnabled ? "cursor-default" : "cursor-pointer"}`}
                    aria-label={isNotificationEnabled ? "알림 켜짐" : "알림 켜기"}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isNotificationEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              )}
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
              {canWithdraw && (
                <button
                  onClick={handleWithdrawClick}
                  className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <UserX size={16} aria-hidden="true" />
                  <span>회원탈퇴</span>
                </button>
              )}
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

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="max-w-sm pb-0">
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠어요?</DialogTitle>
            <DialogDescription>
              탈퇴 후에는 계정을 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-0 space-x-2">
            <DialogClose asChild>
              <button className="my-2 rounded-md px-4 text-gray-800">
                취소
              </button>
            </DialogClose>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <button
              className="my-2 rounded-md px-4 font-bold text-red-600"
              onClick={handleWithdrawConfirm}
            >
              탈퇴하기
            </button>
            <div className="h-[1px] w-full bg-gray-200"></div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsActionButton;
