import Image from "next/image";

import { NotificationDropdown } from "@/widgets/NotificationDropdown";

const HomeHeader = () => {
  return (
    <div className="px-6 pt-6 pb-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="logo"
            className="h-10 w-10"
            width={40}
            height={40}
          />
          <p className="text-2xl font-bold">Haemeok</p>
        </div>

        {/* 알림 드롭다운 */}
        <NotificationDropdown />
      </div>
    </div>
  );
};

export default HomeHeader;
