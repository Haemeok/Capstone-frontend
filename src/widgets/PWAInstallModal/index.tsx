"use client";

import { CheckCircle2, Share, Smartphone, Zap } from "lucide-react";

import { PWA_BENEFITS } from "@/shared/config/constants/pwa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
      <DialogContent className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-[360px]">
        {/* 헤더 영역 - 그라디언트 배경 */}
        <div className="from-olive-light/20 via-olive-mint/15 to-olive-medium/10 bg-gradient-to-br px-6 pt-8 pb-6">
          <div className="flex flex-col items-center gap-4">
            {/* 앱 아이콘 */}
            <div className="relative">
              <div className="from-olive-light/30 to-olive-mint/30 absolute -inset-2 rounded-2xl bg-gradient-to-br blur-lg" />
              <img
                src="/web-app-manifest-192x192.png"
                alt="레시피오"
                className="relative h-20 w-20 rounded-2xl shadow-lg ring-4 ring-white/80"
              />
              <div className="from-olive-mint to-olive-medium absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br shadow-md">
                <Smartphone size={14} className="text-white" />
              </div>
            </div>

            {/* 타이틀 */}
            <div className="space-y-1 text-center">
              <DialogTitle className="text-xl font-bold text-gray-900">
                레시피오 앱 설치
              </DialogTitle>
              <p className="text-sm text-gray-500">
                홈 화면에서 바로 접속하세요
              </p>
            </div>
          </div>
        </div>

        {/* 혜택 목록 */}
        <div className="space-y-3 px-6 py-5">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Zap size={16} className="text-olive-mint" />
            <span>설치하면 이런 점이 좋아요</span>
          </div>
          <ul className="space-y-2.5">
            {PWA_BENEFITS.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5"
              >
                <CheckCircle2
                  size={18}
                  className="text-olive-mint flex-shrink-0"
                />
                <span className="text-sm text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* iOS 안내 섹션 */}
        {isIOS && (
          <div className="mx-6 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 text-sm font-semibold text-amber-800">
              Safari에서 설치하기
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="from-olive-medium to-olive-mint flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm">
                  1
                </span>
                <span className="pt-0.5 text-sm text-amber-700">
                  하단{" "}
                  <Share
                    className="text-olive-medium mx-0.5 inline-block"
                    size={16}
                  />{" "}
                  <strong>공유</strong> 버튼 탭
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="from-olive-medium to-olive-mint flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm">
                  2
                </span>
                <span className="pt-0.5 text-sm text-amber-700">
                  <strong>"홈 화면에 추가"</strong> 선택
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="from-olive-medium to-olive-mint flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm">
                  3
                </span>
                <span className="pt-0.5 text-sm text-amber-700">
                  <strong>"추가"</strong> 탭하여 완료
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <DialogFooter className="flex flex-col gap-2.5 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-col">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="from-olive-medium to-olive-mint h-12 w-full rounded-xl bg-gradient-to-r font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              홈 화면에 추가하기
            </button>
          )}
          <button
            onClick={handleSkipClick}
            className="h-11 w-full rounded-xl font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            {isIOS ? "닫기" : "나중에 할게요"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallModal;
