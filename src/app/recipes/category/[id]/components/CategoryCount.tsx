type CategoryCountProps = {
  total: number | undefined;
};

const CategoryCount = ({ total }: CategoryCountProps) => {
  if (total == null) return null;
  return <span className="text-ink-muted text-sm">전체 {total}</span>;
};

export default CategoryCount;
