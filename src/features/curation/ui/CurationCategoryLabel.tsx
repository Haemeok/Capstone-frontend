type CurationCategoryLabelProps = {
  category: string;
};

export const CurationCategoryLabel = ({
  category,
}: CurationCategoryLabelProps) => (
  <p className="text-sm font-bold tracking-[0.1em] text-green-900 uppercase">
    {category}
  </p>
);
