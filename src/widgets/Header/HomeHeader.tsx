import Link from "next/link";
import { Download } from "lucide-react";

import { Image } from "@/shared/ui/image/Image";

import NotificationButton from "./NotificationButton";

const HomeHeader = () => {
  return (
    <div className="relative h-20 w-full md:hidden">
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
        <Link href="/install-guide" className="flex items-center gap-2">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="logo"
            wrapperClassName="h-10 w-10 rounded-lg"
            skeletonClassName="h-10 w-10 rounded-full"
            width={40}
            height={40}
          />
          <p className="text-2xl font-bold">Recipi'O</p>
        </Link>
        <Link
          href="/install-guide"
          className="bg-olive-light/10 text-olive-light hover:bg-olive-light/20 flex h-8 items-center justify-center gap-1.5 rounded-full px-3 transition-colors"
          aria-label="앱 설치 가이드"
        >
          <Download size={14} />
          <span className="text-xs font-bold">앱 설치</span>
        </Link>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2">
        <NotificationButton />
      </div>
    </div>
  );
};

export default HomeHeader;
