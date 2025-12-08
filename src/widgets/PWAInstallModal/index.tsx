"use client";

import { Share } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type PWAInstallModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInstall: () => void;
  onSkip: () => void;
  isIOS?: boolean;
};

const PWAInstallModal = ({
  isOpen,
  onOpenChange,
  onInstall,
  onSkip,
  isIOS = false,
}: PWAInstallModalProps) => {
  const handleInstallClick = () => {
    onInstall();
    if (!isIOS) {
      onOpenChange(false);
    }
  };

  const handleSkipClick = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 shadow-xl sm:max-w-sm">
        <DialogHeader className="text-sidebar-accent-foreground">
          <div className="flex justify-center">
            <img
              src="/web-app-manifest-192x192.png"
              alt="레시피오 앱 설치"
              className="h-20 w-20 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-gray-900">
              레시피오 앱 설치
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-gray-500">
              ✔️ 홈 화면에 추가하면 앱처럼 빠르게 접속할 수 있어요.
              <br />
              ✔️ 별도 업데이트 없이 항상 최신 기능을 사용하세요.
            </DialogDescription>
          </div>
        </DialogHeader>

        {isIOS ? (
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              아래 단계를 따라 설치하세요:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="bg-olive-mint flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  1
                </span>
                <span>
                  하단의{" "}
                  <Share className="inline-block" size={16} strokeWidth={2} />{" "}
                  <strong>공유 버튼</strong>을 탭하세요
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-olive-mint flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  2
                </span>
                <span>
                  <strong>"홈 화면에 추가"</strong>를 선택하세요
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-olive-mint flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  3
                </span>
                <span>
                  <strong>"추가"</strong>를 탭하여 완료하세요
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex flex-col gap-3 pt-2 sm:flex-col">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="bg-olive-medium h-12 w-full rounded-xl font-medium text-white"
            >
              홈 화면에 추가
            </button>
          )}
          <button
            onClick={handleSkipClick}
            className="h-12 w-full border border-gray-200 font-medium text-gray-500 hover:text-gray-700"
          >
            {isIOS ? "닫기" : "나중에"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallModal;
