"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

import useScrollAnimate from "../hooks/useScrollAnimate";

type PointDisplayBannerProps = {
  prefix: string;
  suffix: string;
  pointText: string;
  containerClassName?: string;
  textClassName?: string;
  icon?: React.ReactNode;

  triggerAnimation?: any;
};

const PointDisplayBanner = ({
  pointText,
  prefix,
  suffix,
  containerClassName,
  textClassName,
  icon,
  triggerAnimation,
}: PointDisplayBannerProps) => {
  const { targetRef, playAnimation } = useScrollAnimate<HTMLDivElement>();

  useEffect(() => {
    if (triggerAnimation !== undefined) {
      playAnimation();
    }
  }, [triggerAnimation, playAnimation]);
  return (
    <div
      ref={targetRef}
      className={cn(
        "flex gap-2 rounded-lg border-1 border-gray-300 p-3 px-2 text-sm",
        containerClassName
      )}
      style={{ opacity: 0 }}
    >
      <div className="flex w-fit items-center">
        <p>{prefix}</p>
        <p className={cn("text-olive-mint mr-1 ml-1 font-bold", textClassName)}>
          {pointText}
        </p>
        <p>{suffix}</p>
        {icon}
      </div>
    </div>
  );
};

export default PointDisplayBanner;
