import type { ReactNode } from "react";

type CategoryContentHeaderProps = {
  title: string;
  description: string;
  sortControl: ReactNode;
};

const CategoryContentHeader = ({
  title,
  description,
  sortControl,
}: CategoryContentHeaderProps) => (
  <div className="flex items-end justify-between px-4 pt-5 pb-3">
    <div className="min-w-0">
      <h2 className="text-ink text-lg font-bold">{title}</h2>
      <p className="text-ink-muted mt-0.5 text-[13px]">{description}</p>
    </div>
    <div className="shrink-0 pl-3">{sortControl}</div>
  </div>
);

export default CategoryContentHeader;
