import Image from "next/image";

const HomeHeader = () => {
  return (
    <div className="px-6 pt-6 pb-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-center gap-2">
        <Image src="/logo.svg" alt="logo" className="h-10 w-10" />
        <p className="text-2xl font-bold">Haemeok</p>
      </div>
    </div>
  );
};

export default HomeHeader;
