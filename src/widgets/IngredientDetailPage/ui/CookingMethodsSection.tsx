import type { CookingMethod } from "@/entities/ingredient";

type CookingMethodsSectionProps = {
  methods: CookingMethod[];
};

const CookingMethodsSection = ({ methods }: CookingMethodsSectionProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">추천 조리법</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
        {methods.map((method) => (
          <div
            key={method.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
          >
            <span className="text-base">{method.icon}</span>
            <span>{method.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CookingMethodsSection;
