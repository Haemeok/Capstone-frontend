"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import { usePWAInstallContext } from "@/app/providers/PWAInstallProvider";
import { Image } from "@/shared/ui/image/Image";
import PWAInstallModal from "@/widgets/PWAInstallModal";

import NotificationButton from "./NotificationButton";
import Link from "next/link";

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
          {isIOS ? (
            <Link href="/install-guide">
              <button
                className="bg-olive-light/10 text-olive-light hover:bg-olive-light/20 flex h-8 items-center justify-center gap-1.5 rounded-full px-3 transition-colors"
                aria-label="앱 설치"
              >
                <Download size={14} />
                <span className="w-10 text-xs font-bold">앱 설치</span>
              </button>
            </Link>
          ) : (
            <button
              className="bg-olive-light/10 text-olive-light hover:bg-olive-light/20 flex h-8 items-center justify-center gap-1.5 rounded-full px-3 transition-colors"
              aria-label="앱 설치"
              onClick={() => setIsModalOpen(true)}
            >
              <Download size={14} />
              <span className="w-10 text-xs font-bold">앱 설치</span>
            </button>
          )}
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
