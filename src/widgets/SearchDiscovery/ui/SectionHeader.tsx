type SectionHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

const SectionHeader = ({ title, action }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-ink text-lg font-bold">{title}</h2>
      {action}
    </div>
  );
};

export default SectionHeader;
