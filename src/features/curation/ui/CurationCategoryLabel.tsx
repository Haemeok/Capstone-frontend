type CurationCategoryLabelProps = {
  category: string;
};

export const CurationCategoryLabel = ({
  category,
}: CurationCategoryLabelProps) => (
  <p className="text-sm font-bold uppercase tracking-[0.1em] text-green-900">
    {category}
  </p>
);
