"use client";

import Link from "next/link";

import { triggerHaptic } from "@/shared/lib/bridge";

type EventCtaButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
};

const baseClass =
  "block w-full rounded-xl bg-brown py-4 text-center text-base font-semibold text-white";

const EventCtaButton = ({ label, href, onClick }: EventCtaButtonProps) => {
  const handleClick = () => {
    triggerHaptic("Medium");
    onClick?.();
  };

  if (href) {
    return (
      <Link href={href} onClick={handleClick} className={baseClass}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClass} cursor-pointer`}
    >
      {label}
    </button>
  );
};

export default EventCtaButton;
