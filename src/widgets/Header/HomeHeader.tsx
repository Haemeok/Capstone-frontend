import Image from "next/image";

import NotificationButton from "./NotificationButton";

const HomeHeader = () => {
  return (
    <div className="relative w-full h-20">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="logo"
          className="h-10 w-10"
          width={40}
          height={40}
        />
        <p className="text-2xl font-bold">Haemeok</p>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <NotificationButton />
      </div>
    </div>
  );
};

export default HomeHeader;
