import { getCookingMethodIcon } from "@/entities/ingredient/lib/cookingMethodIcon";

type CookingMethodsSectionProps = {
  methods: string[];
};

const CookingMethodsSection = ({ methods }: CookingMethodsSectionProps) => {
  if (methods.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">추천 조리법</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
        {methods.map((method) => {
          const icon = getCookingMethodIcon(method);
          return (
            <span
              key={method}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
            >
              {icon && <span className="text-base">{icon}</span>}
              <span>{method}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default CookingMethodsSection;
