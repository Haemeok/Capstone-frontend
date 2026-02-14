import { type ReactNode } from "react";

type ArticleSectionProps = {
  title: string;
  children: ReactNode;
};

const ArticleSection = ({ title, children }: ArticleSectionProps) => {
  return (
    <section className="border-t border-gray-100 pt-8">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-gray-700">
        {children}
      </div>
    </section>
  );
};

export default ArticleSection;
