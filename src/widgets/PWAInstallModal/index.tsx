"use client";

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
};

const PWAInstallModal = ({
  isOpen,
  onOpenChange,
  onInstall,
  onSkip,
}: PWAInstallModalProps) => {
  const handleInstallClick = () => {
    onInstall();
    onOpenChange(false);
  };

  const handleSkipClick = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm border-0 shadow-xl">
        <DialogHeader className="text-sidebar-accent-foreground">
          <div className="flex justify-center">
            <img
              src="/pwa_logo.png"
              alt="해먹 앱 설치"
              className="w-20 h-20 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-gray-900">
              해먹 앱 설치
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 leading-relaxed">
              홈 화면에 추가하면 앱처럼 빠르게 접속할 수 있어요.
              <br />
              별도 업데이트 없이 항상 최신 기능을 사용하세요.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleInstallClick}
            className="w-full bg-olive-mint hover:bg-olive-medium text-white font-medium h-12 rounded-xl"
          >
            홈 화면에 추가
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkipClick}
            className="w-full text-gray-500 hover:text-gray-700 font-medium h-12"
          >
            나중에
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallModal;
