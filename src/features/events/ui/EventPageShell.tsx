import type { ReactNode } from "react";

import PrevButton from "@/shared/ui/PrevButton";

type EventPageShellProps = {
  title: string;
  children: ReactNode;
} & (
  | { hero: ReactNode; heroSrc?: never; heroAlt?: never }
  | { hero?: never; heroSrc: string; heroAlt: string }
);

const EventPageShell = (props: EventPageShellProps) => {
  const { title, children } = props;
  const hero =
    typeof props.heroSrc === "string" ? (
      <img src={props.heroSrc} alt={props.heroAlt} className="h-auto w-full" />
    ) : (
      props.hero
    );

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white md:border-x md:border-gray-100">
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-3">
        <PrevButton showOnDesktop />
        <h1 className="text-ink truncate text-base font-semibold">{title}</h1>
      </header>
      {hero}
      <main className="text-pretty break-keep">{children}</main>
    </div>
  );
};

export default EventPageShell;
