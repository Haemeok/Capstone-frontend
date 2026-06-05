import type { ReactNode } from "react";

type EventSectionProps = {
  title: string;
  children: ReactNode;
};

const EventSection = ({ title, children }: EventSectionProps) => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-brown mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
};

export default EventSection;
