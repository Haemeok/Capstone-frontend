"use client";

import { PWA_BENEFITS } from "@/shared/config/constants/pwa";
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            📱 해먹을 홈 화면에 추가
          </DialogTitle>
          <DialogDescription className="text-center">
            앱처럼 빠르게 접속하고 해먹의 모든 기능을 편리하게 이용해 보세요!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {PWA_BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 text-sm text-gray-600"
            >
              <span className="text-green-500">✓</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleSkipClick}
            className="flex-1"
          >
            나중에
          </Button>
          <Button onClick={handleInstallClick} className="flex-1">
            홈 화면에 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallModal;
