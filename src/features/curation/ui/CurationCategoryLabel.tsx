type CurationCategoryLabelProps = {
  label?: string;
};

export const CurationCategoryLabel = ({
  label = "FOOD & LIFE",
}: CurationCategoryLabelProps) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive-dark">
    {label}
  </p>
);
