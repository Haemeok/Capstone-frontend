"use client";

import { requestAppReview } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import AppInstallButton from "./AppInstallButton";
import NotificationButton from "./NotificationButton";

const HomeHeader = () => {
  return (
    <div className="relative flex w-full flex-col items-center pt-4 pb-2 md:hidden">
      <div className="relative flex w-full items-center justify-center px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="logo"
            wrapperClassName="h-10 w-10 rounded-lg"
            skeletonClassName="h-10 w-10 rounded-full"
            width={40}
            height={40}
          />
          <p className="text-2xl font-bold">Recipi'O</p>
        </div>
        <div className="absolute right-6 flex items-center gap-2">
          <button
            onClick={() => requestAppReview()}
            className="rounded-lg bg-olive-light px-2 py-1 text-xs font-medium text-white"
          >
            리뷰 테스트
          </button>
          <NotificationButton />
        </div>
      </div>
      <AppInstallButton />
    </div>
  );
};

export default HomeHeader;
