"use client";

import { CONTENT_PAGES } from "@/shared/config/constants/content-pages";

import ContentPageCard from "./ContentPageCard";

const ContentPageGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {CONTENT_PAGES.map((page) => (
        <ContentPageCard key={page.id} page={page} />
      ))}
    </div>
  );
};

export default ContentPageGrid;
