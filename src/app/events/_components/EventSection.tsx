import type { ReactNode } from "react";

type EventSectionProps = {
  title: string;
  label?: string;
  align?: "left" | "center";
  children: ReactNode;
};

const EventSection = ({
  title,
  label,
  align = "left",
  children,
}: EventSectionProps) => {
  return (
    <section className={`px-5 py-8 ${align === "center" ? "text-center" : ""}`}>
      {label ? (
        <p className="mb-1.5 text-xs font-bold tracking-widest text-blue-500 uppercase">
          {label}
        </p>
      ) : null}
      <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
};

export default EventSection;
