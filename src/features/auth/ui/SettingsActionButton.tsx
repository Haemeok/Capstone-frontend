"use client";

import { useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Bell,
  FileText,
  LogOut,
  Settings,
  UserX,
} from "lucide-react";

import { useSettingsDict } from "@/shared/i18n";
import {
  isAppWebView,
  requestNotificationPermission,
} from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import { useReferralSheetStore } from "@/entities/referral";

import useDeleteAccountMutation from "@/features/auth/model/hooks/useDeleteAccountMutation";
import useLogoutMutation from "@/features/auth/model/hooks/useLogoutMutation";
import { useNotificationPermissionStore } from "@/features/notification-permission";

import { AdRemovalRow } from "./AdRemovalRow";
import { LanguageSettingRow } from "./LanguageSettingRow";

const SettingsActionButton = () => {
  const t = useSettingsDict();
  const { mutate: logout } = useLogoutMutation();
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteAccountMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const { Container, Content, Header, Title, Description, Footer, Close } =
    useResponsiveSheet();

  const isInApp = isAppWebView();
  const notificationStatus = useNotificationPermissionStore(
    (state) => state.status
  );
  const [isNotificationOn, setIsNotificationOn] = useState(
    notificationStatus === "granted"
  );

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
        aria-label={t.title}
        className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
      >
        <Settings size={20} aria-hidden="true" />
      </button>
      {isModalOpen && (
        <Container open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Content className="p-0 sm:p-6 md:max-w-sm">
            <Header>
              <Title className="text-lg">{t.title}</Title>
              <Description className="sr-only">{t.srDescription}</Description>
            </Header>

            <div className="flex flex-col border-t border-gray-200 sm:border-none">
              <AdRemovalRow
                onOpenSheet={() => {
                  setIsModalOpen(false);
                  useReferralSheetStore.getState().open();
                }}
              />
              <LanguageSettingRow />
              {isInApp && (
                <div className="flex w-full items-center justify-between px-4 py-3">
                  <div className="text-ink-sub flex items-center gap-2">
                    <Bell size={16} aria-hidden="true" />
                    <span>{t.notifications}</span>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                      isNotificationOn ? "bg-green-500" : "bg-gray-300"
                    }`}
                    aria-label={
                      isNotificationOn
                        ? t.notificationsOnAria
                        : t.notificationsOffAria
                    }
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
                className="text-ink-sub flex w-full items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <FileText size={16} aria-hidden="true" />
                <span>{t.privacy}</span>
              </Link>
              <a
                href="https://slashpage.com/recipio/n5w9812gwype424kpgze"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-sub flex w-full items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <span aria-hidden="true">💬</span>
                <span>{t.reviews}</span>
              </a>
              <a
                href="https://slashpage.com/recipio/943zqpmqxn63g2wnvy87"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-sub flex w-full items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <span aria-hidden="true">🐛</span>
                <span>{t.reportError}</span>
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdVUjr7LsnvG-WVG46cBhQOOUJN82irzTaKVS2Uthl6qKZgVg/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-sub flex w-full items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <AlertTriangle size={16} aria-hidden="true" />
                <span>{t.copyrightReport}</span>
              </a>
              <button
                onClick={handleWithdrawClick}
                disabled={isDeleting}
                className="text-ink-sub flex w-full items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserX size={16} aria-hidden="true" />
                <span>{t.withdraw}</span>
              </button>
            </div>

            <Footer className="flex-col gap-0 p-0 sm:flex-row sm:justify-end sm:gap-2">
              <button
                onClick={handleLogoutClick}
                aria-label={t.logout}
                className="flex w-full cursor-pointer items-center justify-center gap-1 border-t border-gray-200 px-4 py-3 font-bold text-red-500 sm:w-auto sm:rounded-md sm:border-none sm:bg-red-50 sm:py-2 sm:hover:bg-red-100"
              >
                <LogOut size={16} aria-hidden="true" className="mr-1" />
                <span>{t.logout}</span>
              </button>
              {Close ? (
                <Close asChild>
                  <button className="text-ink w-full cursor-pointer border-t border-gray-200 px-4 py-3 font-bold sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:py-2 sm:hover:bg-gray-50">
                    {t.close}
                  </button>
                </Close>
              ) : (
                <button
                  className="text-ink w-full cursor-pointer border-t border-gray-200 px-4 py-3 font-bold sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:py-2 sm:hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t.close}
                </button>
              )}
            </Footer>
          </Content>
        </Container>
      )}

      <DeleteModal
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
        title={t.withdrawTitle}
        description={t.withdrawDescription}
        onConfirm={handleWithdrawConfirm}
        cancelLabel={t.cancel}
        confirmLabel={isDeleting ? t.withdrawDeleting : t.withdrawConfirm}
      />
    </>
  );
};

export default SettingsActionButton;
