"use client";

import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui/shadcn/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type IOSInstallGuideModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const IOSInstallGuideModal = ({
  isOpen,
  onOpenChange,
}: IOSInstallGuideModalProps) => {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleApiChange = (api: CarouselApi) => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] border-0 p-0 shadow-xl sm:max-w-md">
        <Carousel
          setApi={handleApiChange}
          className="w-full max-w-full min-w-0"
        >
          <CarouselContent className="-ml-0">
            <CarouselItem className="pl-0">
              <div className="flex w-full flex-col items-center justify-center p-6 pb-10">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/web-app-manifest-192x192.png"
                    alt="레시피오 앱"
                    className="h-20 w-20 rounded-lg"
                  />
                </div>
                <DialogHeader className="mb-4 w-full text-center">
                  <DialogTitle className="mb-3 text-xl font-bold text-gray-900">
                    레시피오 앱을
                    <br />
                    설치해보세요!
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-olive-mint flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">빠른 접속</p>
                      <p className="text-sm text-gray-600">
                        홈 화면에서 바로 실행, 1초 이내 접속
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-olive-mint flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        🎁 AI 레시피 매일 1회 무료
                      </p>
                      <p className="text-sm text-gray-600">
                        앱 설치 시 AI 생성권 추가 제공
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-olive-mint flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        영양성분 추적
                      </p>
                      <p className="text-sm text-gray-600">
                        먹은 음식의 영양 정보 자동 기록
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="flex w-full flex-col items-center justify-center p-4 pb-10">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  1. 하단 공유 버튼을 탭하세요
                </h3>
                <div className="w-full max-w-xs overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="/제목 없음.png"
                    alt="공유 버튼 탭하기"
                    className="h-auto max-h-[400px] w-full object-contain"
                  />
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="flex w-full flex-col items-center justify-center p-4 pb-10">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  2. 안내 모달을 위로 드래그하세요
                </h3>
                <div className="w-full max-w-xs overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="/제목 없음3.png"
                    alt="홈 화면에 추가 선택"
                    className="h-auto max-h-[400px] w-full object-contain"
                  />
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="flex w-full flex-col items-center justify-center p-4 pb-10">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  3. "홈 화면에 추가" 버튼을 탭하세요
                </h3>
                <div className="w-full max-w-xs overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="/제목 없음1.png"
                    alt="추가 버튼 탭하기"
                    className="h-auto max-h-[400px] w-full object-contain"
                  />
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="flex w-full flex-col items-center justify-center p-6 pb-10">
                <div className="mb-4 flex justify-center">
                  <div className="bg-olive-mint flex h-16 w-16 items-center justify-center rounded-full text-3xl">
                    ✓
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  설치 완료!
                </h3>
                <p className="mb-5 text-center text-sm text-gray-600">
                  이제 홈 화면에서 레시피오를
                  <br />
                  빠르게 이용하실 수 있습니다.
                </p>
                <div className="w-full rounded-lg bg-gray-50 p-3">
                  <p className="text-center text-xs text-gray-700">
                    💡 이 가이드는 <strong>마이페이지 → 설정</strong>에서
                    <br />
                    다시 확인할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="bg-olive-medium mt-5 w-full rounded-xl py-2.5 font-medium text-white"
                >
                  확인
                </button>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center gap-2 pb-4">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current ? "bg-olive-mint w-6" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IOSInstallGuideModal;
