type SubstitutesSectionProps = {
  items: string[];
};

const SubstitutesSection = ({ items }: SubstitutesSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-1">대체 재료</h2>
      <p className="text-sm text-gray-500 mb-3">없을 때 이렇게도 가능해요</p>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
        {items.map((name) => (
          <span
            key={name}
            className="inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default SubstitutesSection;
