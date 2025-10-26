"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";

import { Image } from "./image/Image";

type HomeBannerProps = {
  title: string;
  description: string;
  image: string;
  to: string;
};

const HomeBanner = ({ title, description, image, to }: HomeBannerProps) => {
  const { targetRef } = useScrollAnimate<HTMLAnchorElement>();

  return (
    <Link
      ref={targetRef}
      href={to}
      className="relative mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg border-1 border-gray-300 p-2 text-sm"
      style={{ opacity: 0 }}
    >
      <Image
        src={image}
        alt={`${title} 배너 이미지`}
        className="h-15 w-15"
        width={60}
        height={60}
      />
      <div className="flex flex-col">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      <ChevronRight
        className="absolute top-1/2 right-2 translate-y-[-50%] text-slate-500"
        aria-hidden="true"
      />
    </Link>
  );
};

export default HomeBanner;
