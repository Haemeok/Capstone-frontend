"use client";

import { useState } from "react";

import { usePWAInstallContext } from "@/app/providers/PWAInstallProvider";
import { Image } from "@/shared/ui/image/Image";
import PWAInstallModal from "@/widgets/PWAInstallModal";

import NotificationButton from "./NotificationButton";

const HomeHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isIOS, promptInstall, skipInstall } =
    usePWAInstallContext();

  return (
    <>
      <div className="relative h-20 w-full md:hidden">
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
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
          
        </div>

        <div className="absolute top-1/2 right-6 -translate-y-1/2">
          <NotificationButton />
        </div>
      </div>

      <PWAInstallModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onInstall={promptInstall}
        onSkip={skipInstall}
        isIOS={isIOS}
      />
    </>
  );
};

export default HomeHeader;
