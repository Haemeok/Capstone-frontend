import type { SearchDiscoveryDict } from "@/shared/i18n/types";

import { ContentPageGrid } from "@/features/content-pages";

type CategoryTabsProps = {
  title: string;
  copy: SearchDiscoveryDict["contentPages"];
};

const CategoryTabs = ({ title, copy }: CategoryTabsProps) => (
  <section className="hidden w-full py-6 md:block">
    <h2 className="text-ink mb-4 text-xl font-bold">{title}</h2>
    <ContentPageGrid copy={copy} layout="home" />
  </section>
);

export default CategoryTabs;
