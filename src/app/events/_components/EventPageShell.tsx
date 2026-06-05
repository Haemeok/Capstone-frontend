import type { ReactNode } from "react";

import PrevButton from "@/shared/ui/PrevButton";

type EventPageShellProps = {
  title: string;
  heroSrc: string;
  heroAlt: string;
  children: ReactNode;
};

const EventPageShell = ({
  title,
  heroSrc,
  heroAlt,
  children,
}: EventPageShellProps) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-3">
        <PrevButton showOnDesktop />
        <h1 className="text-brown truncate text-base font-semibold">{title}</h1>
      </header>
      <img src={heroSrc} alt={heroAlt} className="h-auto w-full" />
      <main>{children}</main>
    </div>
  );
};

export default EventPageShell;
