type SubstitutesSectionProps = {
  items: string[];
};

const SubstitutesSection = ({ items }: SubstitutesSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-1">대체 재료</h2>
      <p className="text-sm text-gray-500 mb-3">없을 때 이렇게도 가능해요</p>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1">
        {items.map((name) => (
          <span
            key={name}
            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default SubstitutesSection;
